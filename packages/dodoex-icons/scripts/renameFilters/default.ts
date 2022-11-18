import path from 'path';

export type RenameFilter = (
  svgPathObj: {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
  },
  innerPath: string,
  options: {
    fileSuffix?: string;
    svgDir: string;
    outputDir: string;
  },
) => string;

/*
 * Return path to write file to inside outputDir.
 * @param {object} svgPathObj
 * path objects from path.parse
 * @param {string} innerPath
 * Path (relative to options.svgDir) to svg file
 *   e.g. if svgFile was /home/user/icons/path/to/svg/file.svg
 *   options.svgDir is /home/user/icons/
 *   innerPath is path/to/svg
 * @param {object} options
 * @returns {string} output file dest relative to outputDir
 */
const defaultDestRewriter: RenameFilter = function (
  svgPathObj,
  innerPath,
  options,
) {
  let fileName = svgPathObj.base;
  if (options.fileSuffix) {
    fileName.replace(options.fileSuffix, '.svg');
  } else {
    fileName = fileName.replace('.svg', '.js');
  }
  fileName = fileName.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase());
  fileName = fileName.replace(/(^.)|(_)(.)/g, (match, p1, p2, p3) =>
    (p1 || p3).toUpperCase(),
  );
  return fileName;
};

export default defaultDestRewriter;
