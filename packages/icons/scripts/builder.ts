import fse from 'fs-extra';
import yargs from 'yargs';
import path from 'path';
import rimraf from 'rimraf';
import Mustache from 'mustache';
import Queue from './waterfall/Queue';
import globAsync from 'fast-glob';
import * as svgo from 'svgo';
import { RenameFilter } from './renameFilters/default';

export const RENAME_FILTER_DEFAULT = './renameFilters/default';

/**
 * Converts directory separators to slashes, so the path can be used in fast-glob.
 * @param {string} pathToNormalize
 * @returns
 */
function normalizePath(pathToNormalize: string) {
  return pathToNormalize.replace(/\\/g, '/');
}

/**
 * Return Pascal-Cased component name.
 * @param {string} destPath
 * @returns {string} class name
 */
export function getComponentName(destPath: string) {
  const splitregex = new RegExp(`[\\${path.sep}-]+`);

  const parts = destPath
    .replace('.js', '')
    .split(splitregex)
    .map((part) => part.charAt(0).toUpperCase() + part.substring(1));

  return parts.join('');
}

async function generateIndex(options: { outputDir: string }) {
  const files = await globAsync(
    normalizePath(path.join(options.outputDir, '*.js')),
  );
  const index = files
    .map((file) => {
      const typename = path.basename(file).replace('.js', '');
      return `export { default as ${typename} } from './${typename}';\n`;
    })
    .join('');

  await fse.writeFile(path.join(options.outputDir, 'index.js'), index);
}

// Noise introduced by Google by mistake
const noises = [
  ['="M0 0h24v24H0V0zm0 0h24v24H0V0z', '="'],
  ['="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z', '="'],
];

function removeNoise(
  input: string | null,
  prevInput: string | null = null,
): string | null {
  if (input === prevInput) {
    return input;
  }

  let output = input || '';

  noises.forEach(([search, replace]) => {
    if (output.indexOf(search) !== -1) {
      output = output.replace(search, replace);
    }
  });

  return removeNoise(output, input);
}

export function cleanPaths({
  svgPath,
  data,
}: {
  svgPath: string;
  data: string;
}) {
  // Remove hardcoded color fill before optimizing so that empty groups are removed
  const input = data
    .replace(/ fill="#010101"/g, '')
    .replace(/<rect fill="none" width="24" height="24"\/>/g, '')
    .replace(/<rect id="SVGID_1_" width="24" height="24"\/>/g, '');

  const result = svgo.optimize(input, {
    floatPrecision: 4,
    multipass: true,
    plugins: [
      { name: 'cleanupAttrs' },
      { name: 'removeDoctype' },
      { name: 'removeXMLProcInst' },
      { name: 'removeComments' },
      { name: 'removeMetadata' },
      { name: 'removeTitle' },
      { name: 'removeDesc' },
      { name: 'removeUselessDefs' },
      { name: 'removeEditorsNSData' },
      { name: 'removeEmptyAttrs' },
      { name: 'removeHiddenElems' },
      { name: 'removeEmptyText' },
      { name: 'removeViewBox' },
      { name: 'cleanupEnableBackground' },
      { name: 'minifyStyles' },
      { name: 'convertStyleToAttrs' },
      { name: 'convertColors' },
      { name: 'convertPathData' },
      { name: 'convertTransform' },
      { name: 'removeUnknownsAndDefaults' },
      { name: 'removeNonInheritableGroupAttrs' },
      {
        name: 'removeUselessStrokeAndFill',
        params: {
          // https://github.com/svg/svgo/issues/727#issuecomment-303115276
          removeNone: true,
        },
      },
      { name: 'removeUnusedNS' },
      { name: 'cleanupIDs' },
      { name: 'cleanupNumericValues' },
      { name: 'cleanupListOfValues' },
      { name: 'moveElemsAttrsToGroup' },
      { name: 'moveGroupAttrsToElems' },
      { name: 'collapseGroups' },
      { name: 'removeRasterImages' },
      { name: 'mergePaths' },
      { name: 'convertShapeToPath' },
      { name: 'sortAttrs' },
      { name: 'removeDimensions' },
      { name: 'removeElementsByAttr' },
      { name: 'removeStyleElement' },
      { name: 'removeScriptElement' },
      { name: 'removeEmptyContainers' },
    ],
  });

  // True if the svg has multiple children
  let childrenAsArray = false;
  const jsxResult = svgo.optimize((result as svgo.OptimizedSvg).data, {
    plugins: [
      {
        name: 'svgAsReactFragment',
        type: 'visitor',
        fn: () => {
          return {
            root: {
              enter(root) {
                const [svg, ...rootChildren] = root.children;
                if (rootChildren.length > 0) {
                  throw new Error('Expected a single child of the root');
                }
                if (svg.type !== 'element' || svg.name !== 'svg') {
                  throw new Error('Expected an svg element as the root child');
                }

                if (svg.children.length > 1) {
                  childrenAsArray = true;
                  svg.children.forEach((svgChild, index) => {
                    svgChild.addAttr({ name: 'key', value: index });
                    // Original name will be restored later
                    // We just need a mechanism to convert the resulting
                    // svg string into an array of JSX elements
                    svgChild.renameElem(`SVGChild:${svgChild.name}`);
                  });
                }
                root.spliceContent(0, svg.children.length, svg.children);
              },
            },
          };
        },
      },
    ],
  });
  // Extract the paths from the svg string
  // Clean xml paths
  // TODO: Implement as svgo plugins instead
  let paths = (jsxResult as svgo.OptimizedSvg).data
    .replace(/"\/>/g, '" />')
    .replace(/fill-opacity=/g, 'fillOpacity=')
    .replace(/xlink:href=/g, 'xlinkHref=')
    .replace(/clip-rule=/g, 'clipRule=')
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/ clip-path=".+?"/g, '') // Fix visibility issue and save some bytes.
    .replace(/<clipPath.+?<\/clipPath>/g, ''); // Remove unused definitions

  const sizeMatch = svgPath.match(/^.*_([0-9]+)px.svg$/);
  const size = sizeMatch ? Number(sizeMatch[1]) : null;

  if (size !== 24 && size) {
    const scale = Math.round((24 / size) * 100) / 100; // Keep a maximum of 2 decimals
    paths = paths.replace('clipPath="url(#b)" ', '');
    paths = paths.replace(
      /<path /g,
      `<path transform="scale(${scale}, ${scale})" `,
    );
  }

  paths = removeNoise(paths) || '';

  if (childrenAsArray) {
    const pathsCommaSeparated = paths
      // handle self-closing tags
      .replace(/key="\d+" \/>/g, '$&,')
      // handle the rest
      .replace(/<\/SVGChild:(\w+)>/g, '</$1>,');
    paths = `[${pathsCommaSeparated}]`;
  }
  paths = paths.replace(/SVGChild:/g, '');

  return paths;
}

async function worker({
  progress,
  svgPath,
  options,
  renameFilter,
  template,
}: {
  progress: () => void;
  svgPath: string;
  options: {
    svgDir: string;
    outputDir: string;
    fileSuffix?: string;
  };
  renameFilter: RenameFilter;
  template: string;
}) {
  progress();

  const normalizedSvgPath = path.normalize(svgPath);
  const svgPathObj = path.parse(normalizedSvgPath);
  const innerPath = path
    .dirname(normalizedSvgPath)
    .replace(options.svgDir, '')
    .replace(path.relative(process.cwd(), options.svgDir), ''); // for relative dirs
  const destPath = renameFilter(svgPathObj, innerPath, options);

  const outputFileDir = path.dirname(path.join(options.outputDir, destPath));
  await fse.ensureDir(outputFileDir);

  const data = await fse.readFile(svgPath, { encoding: 'utf8' });
  const paths = cleanPaths({ svgPath, data });

  const componentName = getComponentName(destPath);

  if (!Mustache.render) return;
  const fileString = (Mustache.render as any)(template, {
    paths,
    componentName,
  });

  const absDestPath = path.join(options.outputDir, destPath);
  await fse.writeFile(absDestPath, fileString);
}

export async function handler(options: {
  disableLog?: boolean;
  outputDir?: string;
  renameFilter?: RenameFilter;
  svgDir?: string;
  glob: string;
}) {
  const progress = options.disableLog
    ? () => {}
    : () => process.stdout.write('.');

  rimraf.sync(`${options.outputDir}/*.js`); // Clean old files

  let renameFilter = options.renameFilter;
  if (typeof renameFilter === 'string') {
    const renameFilterModule = await import(renameFilter);
    renameFilter = renameFilterModule.default;
  }
  const outputDir = options.outputDir || '';
  const svgDir = options.svgDir || '';
  if (typeof renameFilter !== 'function') {
    throw Error('renameFilter must be a function');
  }
  await fse.ensureDir(outputDir);

  const [svgPaths, template] = await Promise.all([
    globAsync(normalizePath(path.join(svgDir, options.glob))),
    fse.readFile(path.join(__dirname, 'templateSvgIcon.ts'), {
      encoding: 'utf8',
    }),
  ]);

  const queue = new Queue(
    (svgPath: string) =>
      worker({
        progress,
        svgPath,
        options: {
          ...options,
          svgDir,
          outputDir,
        },
        renameFilter: renameFilter as RenameFilter,
        template,
      }),
    { concurrency: 8 },
  );

  queue.push(svgPaths as any);
  await queue.wait({ empty: true });

  let generatedFiles = await globAsync(
    normalizePath(path.join(outputDir, '*.js')),
  );
  generatedFiles = generatedFiles.map((file) => path.basename(file));

  await generateIndex({
    outputDir,
  });
}

if (require.main === module) {
  yargs
    .command({
      command: '$0>',
      // description: "Build JSX components from SVG's.",
      handler,
      builder: (command) => {
        return command
          .option('output-dir', {
            required: true,
            type: 'string',
            describe: 'Directory to output jsx components',
          })
          .option('svg-dir', {
            required: true,
            type: 'string',
            describe: 'Directory to output jsx components',
          })
          .option('glob', {
            type: 'string',
            describe: 'Glob to match inside of --svg-dir',
            default: '**/*.svg',
          })
          .option('inner-path', {
            type: 'string',
            describe:
              '"Reach into" subdirs, since libraries like material-design-icons' +
              ' use arbitrary build directories to organize icons' +
              ' e.g. "action/svg/production/icon_3d_rotation_24px.svg"',
            default: '',
          })
          .option('file-suffix', {
            type: 'string',
            describe:
              'Filter only files ending with a suffix (pretty much only for @mui/icons-material)',
          })
          .option('rename-filter', {
            type: 'string',
            describe:
              'Path to JS module used to rename destination filename and path.',
            default: RENAME_FILTER_DEFAULT,
          })
          .option('disable-log', {
            type: 'boolean',
            describe: 'If true, does not produce any output in STDOUT.',
            default: false,
          });
      },
    })
    .help()
    .strict(true)
    .version(false)
    .parse();
}
