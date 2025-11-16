'use client';

import { lazy } from 'react';
import withMoonLoader from '@/components/MoonLoaderHOC';

const Stats = lazy(() => import('@/components/Statistics'));
const StatsWithLoader = withMoonLoader(Stats);

export default function StatsPage() {
    return <StatsWithLoader />;
}