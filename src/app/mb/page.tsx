import React from 'react';
import RetroCV from '@/components/RetroCV';
import { mockCV } from '@/mocks/cv-data';

const MarioPage: React.FC = () => {
  return (
    <main>
      <RetroCV cv={mockCV} />
    </main>
  );
};

export default MarioPage;
