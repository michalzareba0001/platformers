import React, { useMemo } from 'react';
import { Image, View } from 'react-native';
import Matter from 'matter-js';

interface PlayerProps {
  body: Matter.Body;
  camera: { x: number; y: number };
  anim: { state: 'idle' | 'run' | 'jump'; frame: number; facing: 1 | -1 };
}

/** HOTFIX: wymuszamy stały rysunek 40x80, niezależnie od rozmiaru plików */
const DRAW_W = 40;
const DRAW_H = 80;

const Player: React.FC<PlayerProps> = ({ body, camera, anim }) => {
  // Wymiary bryły fizycznej
  const bodyH = body.bounds.max.y - body.bounds.min.y;

  /** HOTFIX: pozycjonowanie po dnie bryły (stopy na tej samej wysokości)
   *  - bottom = środek Y + połowa wysokości bryły
   *  - top = bottom - wysokość rysunku
   */
  const bottom = body.position.y + bodyH / 2;
  const left = Math.round(body.position.x - DRAW_W / 2 - (camera?.x || 0));
  const top  = Math.round(bottom - DRAW_H - (camera?.y || 0));

  const frames = useMemo(() => {
    const idle = [
      require('../assets/hero/armor__0000_idle_1.png'),
      require('../assets/hero/armor__0001_idle_2.png'),
      require('../assets/hero/armor__0002_idle_3.png'),
    ];
    const run = [
      require('../assets/hero/armor__0012_run_1.png'),
      require('../assets/hero/armor__0014_run_3.png'),
      require('../assets/hero/armor__0013_run_2.png'),
      require('../assets/hero/armor__0015_run_4.png'),
      require('../assets/hero/armor__0016_run_5.png'),
      require('../assets/hero/armor__0017_run_6.png'),
    ];
    const jump = [
      require('../assets/hero/armor__0027_jump_1.png'),
      require('../assets/hero/armor__0028_jump_2.png'),
      require('../assets/hero/armor__0028_jump_3.png'),
      require('../assets/hero/armor__0030_jump_4.png'),
    ];
    return { idle, run, jump };
  }, []);

  const arr = frames[anim.state] || frames.idle;
  const frame = arr[arr.length ? (anim.frame % arr.length) : 0];

  return (
    <View
      pointerEvents="none" // HOTFIX: nie blokuj dotyku przycisków overlay
      style={{
        position: 'absolute',
        left,
        top,
        width: DRAW_W,
        height: DRAW_H,
        overflow: 'hidden', // stabilizuje raster i eliminuje „pompowanie”
      }}
    >
      <Image
        source={frame}
        resizeMode="contain"
        style={{
          width: '100%',
          height: '100%',
          transform: [{ scaleX: anim.facing }], // flip na samym obrazku
          backfaceVisibility: 'hidden',
        }}
      />
    </View>
  );
};

export default Player;
