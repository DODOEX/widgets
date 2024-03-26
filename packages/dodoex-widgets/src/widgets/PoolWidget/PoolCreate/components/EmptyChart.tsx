import { t } from '@lingui/macro';
import { EmptyList } from '../../../../components/List/EmptyList';

export default function EmptyChart({
  height,
  text,
}: {
  height?: number | string;
  text?: string;
}) {
  return (
    <EmptyList
      sx={{
        height: height || 261,
      }}
      emptyText={text || t`Enter parameters to view the yield curve`}
    />
  );
}
