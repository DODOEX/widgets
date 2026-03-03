import { ChainId } from '@dodoex/api';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CPFavoriteItem {
  id: string; // Pool address/ID from Crowdpooling.id
  chainId: ChainId; // Chain ID from Crowdpooling.chainId
}

interface CPFavoritesState {
  favorites: CPFavoriteItem[];
}

export const useCPFavorites = create(
  persist<CPFavoritesState>(
    (set) => ({
      favorites: [],
    }),
    {
      name: 'cp-favorites-storage',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : undefined,
      ),
    },
  ),
);

/**
 * Check if a pool is favorited
 */
export function isFavorite(
  favorites: CPFavoriteItem[],
  id: string,
  chainId: ChainId,
): boolean {
  return favorites.some(
    (item) =>
      item.id.toLowerCase() === id.toLowerCase() && item.chainId === chainId,
  );
}

/**
 * Add a pool to favorites
 */
export function addFavorite(id: string, chainId: ChainId): void {
  const { favorites } = useCPFavorites.getState();
  // Check if already exists to avoid duplicates
  if (isFavorite(favorites, id, chainId)) {
    return;
  }

  useCPFavorites.setState((prev) => ({
    favorites: [...prev.favorites, { id, chainId }],
  }));
}

/**
 * Remove a pool from favorites
 */
export function removeFavorite(id: string, chainId: ChainId): void {
  const idLow = id.toLowerCase();
  useCPFavorites.setState((prev) => ({
    favorites: prev.favorites.filter(
      (item) => !(item.id.toLowerCase() === idLow && item.chainId === chainId),
    ),
  }));
}

/**
 * Toggle favorite status of a pool
 */
export function toggleFavorite(id: string, chainId: ChainId): void {
  const idLow = id.toLowerCase();
  useCPFavorites.setState((prev) => {
    const result = [...prev.favorites];
    const findIndex = result.findIndex(
      (item) => item.id.toLowerCase() === idLow && item.chainId === chainId,
    );
    if (findIndex > -1) {
      result.splice(findIndex, 1);
    } else {
      result.push({
        id,
        chainId,
      });
    }
    return {
      favorites: result,
    };
  });
}

/**
 * Get all favorited pools
 */
export function getFavorites(): CPFavoriteItem[] {
  return useCPFavorites.getState().favorites;
}

/**
 * Clear all favorites (for maintenance)
 */
export function clearFavorites(): void {
  useCPFavorites.setState({ favorites: [] });
}
