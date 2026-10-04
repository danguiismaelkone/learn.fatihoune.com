import * as migration_20261003_012412_initial from './20261003_012412_initial';
import * as migration_20261003_061357_media_credit from './20261003_061357_media_credit';
import * as migration_20261003_064500_hero_variant_search from './20261003_064500_hero_variant_search';
import * as migration_20261004_124139_lot2_training_badges from './20261004_124139_lot2_training_badges';
import * as migration_20261004_133717_lot1_callback_socials from './20261004_133717_lot1_callback_socials';

export const migrations = [
  {
    up: migration_20261003_012412_initial.up,
    down: migration_20261003_012412_initial.down,
    name: '20261003_012412_initial',
  },
  {
    up: migration_20261003_061357_media_credit.up,
    down: migration_20261003_061357_media_credit.down,
    name: '20261003_061357_media_credit',
  },
  {
    up: migration_20261003_064500_hero_variant_search.up,
    down: migration_20261003_064500_hero_variant_search.down,
    name: '20261003_064500_hero_variant_search',
  },
  {
    up: migration_20261004_124139_lot2_training_badges.up,
    down: migration_20261004_124139_lot2_training_badges.down,
    name: '20261004_124139_lot2_training_badges',
  },
  {
    up: migration_20261004_133717_lot1_callback_socials.up,
    down: migration_20261004_133717_lot1_callback_socials.down,
    name: '20261004_133717_lot1_callback_socials'
  },
];
