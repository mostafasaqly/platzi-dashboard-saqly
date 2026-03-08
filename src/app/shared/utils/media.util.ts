export const IMAGE_FALLBACKS = {
  product: '/product-placeholder.png',
  category: '/category-placeholder.png',
  user: '/avatar-placeholder.png',
} as const;

const BLOCKED_IMAGE_HOSTS = [
  'pravatar.cc',
  'placeimg.com',
  'api.lorem.space',
] as const;

export function isValidImageUrl(value: string | null | undefined): boolean {
  if (!value?.trim()) {
    return false;
  }

  const normalized = value.trim().toLowerCase();

  if (
    normalized.startsWith('face?w=') ||
    normalized.includes('&amp;')
  ) {
    return false;
  }

  if (!/^https?:\/\/.+/i.test(normalized)) {
    return false;
  }

  return !BLOCKED_IMAGE_HOSTS.some((host) => normalized.includes(host));
}

export function resolveImageUrl(
  value: string | null | undefined,
  fallback: string,
): string {
  return isValidImageUrl(value) ? value!.trim() : fallback;
}

export function resolveFirstImage(
  values: string[] | null | undefined,
  fallback: string,
): string {
  const firstValid = values?.find((item) => isValidImageUrl(item));
  return firstValid || fallback;
}

export function resolveAvatarLabel(name: string | null | undefined): string {
  return name?.trim().charAt(0).toUpperCase() || 'U';
}
