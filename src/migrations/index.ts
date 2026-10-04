import * as migration_20261003_012412_initial from './20261003_012412_initial';
import * as migration_20261003_061357_media_credit from './20261003_061357_media_credit';
import * as migration_20261003_064500_hero_variant_search from './20261003_064500_hero_variant_search';
import * as migration_20261004_124139_lot2_training_badges from './20261004_124139_lot2_training_badges';
import * as migration_20261004_133717_lot1_callback_socials from './20261004_133717_lot1_callback_socials';
import * as migration_20261004_142020_lot4_lead_qualification from './20261004_142020_lot4_lead_qualification';
import * as migration_20261004_142608_lot5_training_detail from './20261004_142608_lot5_training_detail';
import * as migration_20261004_150246_training_image from './20261004_150246_training_image';
import * as migration_20261004_181542_navigation_search from './20261004_181542_navigation_search';
import * as migration_20261004_190657_home_photo_cards_band from './20261004_190657_home_photo_cards_band';
import * as migration_20261004_191542_list_style from './20261004_191542_list_style';
import * as migration_20261004_203920_visitor_confirmation from './20261004_203920_visitor_confirmation';

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
    name: '20261004_133717_lot1_callback_socials',
  },
  {
    up: migration_20261004_142020_lot4_lead_qualification.up,
    down: migration_20261004_142020_lot4_lead_qualification.down,
    name: '20261004_142020_lot4_lead_qualification',
  },
  {
    up: migration_20261004_142608_lot5_training_detail.up,
    down: migration_20261004_142608_lot5_training_detail.down,
    name: '20261004_142608_lot5_training_detail',
  },
  {
    up: migration_20261004_150246_training_image.up,
    down: migration_20261004_150246_training_image.down,
    name: '20261004_150246_training_image',
  },
  {
    up: migration_20261004_181542_navigation_search.up,
    down: migration_20261004_181542_navigation_search.down,
    name: '20261004_181542_navigation_search',
  },
  {
    up: migration_20261004_190657_home_photo_cards_band.up,
    down: migration_20261004_190657_home_photo_cards_band.down,
    name: '20261004_190657_home_photo_cards_band',
  },
  {
    up: migration_20261004_191542_list_style.up,
    down: migration_20261004_191542_list_style.down,
    name: '20261004_191542_list_style',
  },
  {
    up: migration_20261004_203920_visitor_confirmation.up,
    down: migration_20261004_203920_visitor_confirmation.down,
    name: '20261004_203920_visitor_confirmation'
  },
];
