import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import type { AuditItemInput } from '../../../shared/audit';

const MAX_DIMENSION = 1024;

export interface PhotoSource {
  uri: string;
  width?: number;
  height?: number;
}

export interface PreparedPhoto {
  item: AuditItemInput;
  thumbnailUri: string;
}

/**
 * Resize a photo (picker asset or shared file) to ≤1024px on its longest edge
 * and return a base64 JPEG audit item plus a local uri for thumbnails. When
 * dimensions are unknown (share-sheet files), resize defensively.
 */
export async function preparePhoto(
  source: PhotoSource,
  id: string,
): Promise<PreparedPhoto> {
  const width = source.width ?? 0;
  const height = source.height ?? 0;
  const dimsKnown = width > 0 && height > 0;
  const landscape = !dimsKnown || width >= height;
  const needsResize = !dimsKnown || width > MAX_DIMENSION || height > MAX_DIMENSION;

  const context = ImageManipulator.manipulate(source.uri);
  if (needsResize) {
    context.resize(landscape ? { width: MAX_DIMENSION } : { height: MAX_DIMENSION });
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
