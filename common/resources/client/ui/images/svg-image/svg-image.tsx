import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import {memo} from 'react';
import clsx from 'clsx';
import {getAssetUrl} from '@common/utils/urls/get-asset-url';

type DangerousHtml = {__html: string} | undefined;

interface Props {
  src: string;
  className?: string;
  height?: string | false;
}
export const SvgImage = memo(({src, className, height = 'h-full'}: Props) => {
  const {data: svgString} = useSvgImageContent(src);
  // render container even if image is not loaded yet, so there's
  // no layout shift if height is provided via className
  return (
    <div
      className={clsx(
        'svg-image-container inline-block bg-no-repeat',
        height,
        className,
      )}
      dangerouslySetInnerHTML={svgString}
    />
  );
});

function useSvgImageContent(src: string) {
  return useQuery({
    queryKey: ['svgImage', getAssetUrl(src)],
    queryFn: () => fetchSvgImageContent(src),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    enabled: !!src,
  });
}

function fetchSvgImageContent(src: string): Promise<DangerousHtml> {
  return axios
    .get(src, {
      responseType: 'text',
    })
    .then(response => {
      return {__html: response.data};
    });
}
