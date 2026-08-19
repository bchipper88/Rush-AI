import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import type { ImagePickerAsset } from 'expo-image-picker';

import type { AuditItemInput } from '../../../shared/audit';

const MAX_DIMENSION = 1024;

export interface PreparedPhoto {
  item: AuditItemInput;
  thumbnailUri: string;
}

/**
 * Resize a picked photo to ≤1024px on its longest edge and return a base64
 * JPEG audit item plus a local uri for thumbnails. Keeps request payloads
 * small enough for the proxy while preserving enough detail for review.
 */
export async function preparePhoto(
  asset: ImagePickerAsset,
  id: string,
): Promise<PreparedPhoto> {
  const landscape = (asset.width || MAX_DIMENSION) >= (asset.height || MAX_DIMENSION);
  const resize = landscape ? { width: MAX_DIMENSION } : { height: MAX_DIMENSION };

  const context = ImageManipulator.manipulate(asset.uri);
  const needsResize =
    (asset.width ?? 0) > MAX_DIMENSION || (asset.height ?? 0) > MAX_DIMENSION;
  if (needsResize) {
    context.resize(resize);
  }
  const rendered = await context.renderAsync();
  const result = await rendered.saveAsync({
    compress: 0.8,
    format: SaveFormat.JPEG,
    base64: true,
  });

  return {
    item: {
      id,
      kind: 'photo',
      base64: result.base64 ?? '',
      mediaType: 'image/jpeg',
    },
    thumbnailUri: result.uri,
  };
}
