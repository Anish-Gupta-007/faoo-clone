'use client';

import { CHONote } from './CHONote';
import { CommunitySignup } from './CommunitySignup';

export function ScrollTransitionWrapper() {
  return (
    <div className="relative">
      <CHONote />
      <CommunitySignup />
    </div>
  );
}

