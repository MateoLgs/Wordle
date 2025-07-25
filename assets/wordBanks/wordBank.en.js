const wordBank = [
  { word: 'APPLE', definition: 'A common fruit with a crisp texture and sweet taste.', synonyms: ['fruit', 'orchard', 'pome'] },
  { word: 'TRAIN', definition: 'A series of connected vehicles traveling on tracks.', synonyms: ['rail', 'locomotive', 'commute'] },
  { word: 'TABLE', definition: 'A piece of furniture with a flat top supported by legs.', synonyms: ['desk', 'surface', 'counter'] },
  { word: 'CHAIR', definition: 'A seat designed for one person, typically with a back.', synonyms: ['seat', 'stool', 'bench'] },
  { word: 'CLOUD', definition: 'A visible mass of condensed water vapor in the sky.', synonyms: ['mist', 'vapor', 'puff'] },
  { word: 'DREAM', definition: 'A series of thoughts or images occurring in sleep.', synonyms: ['vision', 'fantasy', 'reverie'] },
  { word: 'EMAIL', definition: 'A message sent electronically between computers.', synonyms: ['message', 'inbox', 'correspondence'] },
  { word: 'FAITH', definition: 'A strong belief or trust in something unseen.', synonyms: ['belief', 'trust', 'conviction'] },
  { word: 'FAULT', definition: 'An imperfection or mistake in a system or person.', synonyms: ['flaw', 'error', 'defect'] },
  { word: 'FIELD', definition: 'An open area of land used for cultivation or play.', synonyms: ['meadow', 'ground', 'arena'] },
  { word: 'GLASS', definition: 'A hard, transparent material often used for windows.', synonyms: ['pane', 'crystal', 'goblet'] },
  { word: 'SMOKE', definition: 'A visible cloud produced by burning material.', synonyms: ['fume', 'ash', 'vapor'] },
  { word: 'GHOST', definition: 'A spirit or apparition of a dead person.', synonyms: ['spirit', 'phantom', 'specter'] },
  { word: 'MOUSE', definition: 'A small rodent with a pointed snout and tail.', synonyms: ['rodent', 'vermin', 'pest'] },
  { word: 'NIGHT', definition: 'The period of darkness between sunset and sunrise.', synonyms: ['darkness', 'evening', 'dusk'] },
  { word: 'MONEY', definition: 'A medium of exchange in the form of coins or bills.', synonyms: ['cash', 'currency', 'funds'] },
  { word: 'HOUSE', definition: 'A building where people live as a family or group.', synonyms: ['home', 'residence', 'dwelling'] },
  { word: 'FRIEND', definition: 'A person you know well and regard with affection.', synonyms: ['pal', 'ally', 'companion'] },
  { word: 'LETTER', definition: 'A character representing one or more sounds in writing.', synonyms: ['note', 'character', 'mail'] },
  { word: 'BREAD', definition: 'A staple food made from flour and water.', synonyms: ['loaf', 'bake', 'toast'] },
  { word: 'TRACK', definition: 'A path or course for vehicles or running.', synonyms: ['path', 'trail', 'route'] },
  { word: 'WATER', definition: 'A clear liquid essential for most plant and animal life.', synonyms: ['liquid', 'aqua', 'drink'] },
  { word: 'EARTH', definition: 'The planet we live on, third from the sun.', synonyms: ['world', 'globe', 'ground'] },
  { word: 'PLATE', definition: 'A flat dish from which food is eaten.', synonyms: ['dish', 'tray', 'platter'] },
  { word: 'STONE', definition: 'A hard, solid nonmetallic mineral matter.', synonyms: ['rock', 'pebble', 'boulder'] },
  { word: 'WHEEL', definition: 'A circular component that rolls on an axle.', synonyms: ['rim', 'gear', 'hoop'] },
  { word: 'SENSE', definition: 'A faculty by which the body perceives stimuli.', synonyms: ['feeling', 'perception', 'intuition'] },
  { word: 'SMIRK', definition: 'A smug or conceited smile.', synonyms: ['grin', 'smile', 'beam'] },
  { word: 'SHINE', definition: 'To give off or reflect light brightly.', synonyms: ['gleam', 'glow', 'sparkle'] },
  { word: 'STORM', definition: 'A violent weather condition with strong winds.', synonyms: ['tempest', 'squall', 'gale'] },
  { word: 'QUEST', definition: 'A search or pursuit to achieve a goal.', synonyms: ['search', 'journey', 'mission'] },
  { word: 'MAGIC', definition: 'The power of apparently influencing events by mysterious means.', synonyms: ['sorcery', 'enchantment', 'witchcraft'] },
  { word: 'OCEAN', definition: 'A vast body of salt water covering much of the Earth.', synonyms: ['sea', 'marine', 'deep'] },
  { word: 'CHECK', definition: 'To examine something for accuracy or condition.', synonyms: ['inspect', 'verify', 'test'] },
  { word: 'BRICK', definition: 'A rectangular block of clay used in building.', synonyms: ['block', 'tile', 'stone'] },
  { word: 'CROWN', definition: 'A decorative headpiece worn by royalty.', synonyms: ['tiara', 'regalia', 'coronet'] },
  { word: 'GLORY', definition: 'High renown or honor won by notable achievements.', synonyms: ['renown', 'honor', 'praise'] },
  { word: 'SKATE', definition: 'To move on ice or a smooth surface using skates.', synonyms: ['glide', 'slide', 'spinning'] },
  { word: 'PAINT', definition: 'A colored substance applied to a surface.', synonyms: ['coat', 'color', 'stain'] },
  { word: 'BLOCK', definition: 'A solid piece of material with flat surfaces.', synonyms: ['chunk', 'cube', 'brick'] },
  { word: 'FRAME', definition: 'A rigid structure that surrounds or encloses something.', synonyms: ['structure', 'border', 'support'] },
  { word: 'STAND', definition: 'To be in an upright position on the feet.', synonyms: ['rise', 'upright', 'perch'] },
  { word: 'SCALE', definition: 'A device for weighing or measuring weight.', synonyms: ['weigh', 'measure', 'balance'] },
  { word: 'SWORD', definition: 'A weapon with a long metal blade.', synonyms: ['blade', 'rapier', 'saber'] },
  { word: 'WHALE', definition: 'A large marine mammal with a streamlined body.', synonyms: ['leviathan', 'cetacean', 'behemoth'] },
  { word: 'TIGER', definition: 'A large wild cat with stripes.', synonyms: ['big cat', 'predator', 'feline'] },
  { word: 'GRAIN', definition: 'Small, hard seeds from cereal plants.', synonyms: ['seed', 'kernel', 'cereal'] },
  { word: 'BRUSH', definition: 'An implement with bristles for cleaning or painting.', synonyms: ['sweep', 'scrub', 'paint'] },
  { word: 'SLEEP', definition: 'A natural state of rest for the mind and body.', synonyms: ['rest', 'nap', 'slumber'] },
  { word: 'SHADE', definition: 'A slight darkness caused by shelter from direct light.', synonyms: ['shadow', 'hue', 'tone'] },
  { word: 'PHOTO', definition: 'An image captured by a camera.', synonyms: ['picture', 'snapshot', 'image'] },
  { word: 'STEAM', definition: 'The gas produced when water boils.', synonyms: ['vapor', 'mist', 'fume'] },
  { word: 'STICK', definition: 'A thin piece of wood that has fallen from a tree.', synonyms: ['branch', 'rod', 'twig'] },
  { word: 'FLOOR', definition: 'The bottom surface of a room.', synonyms: ['ground', 'deck', 'story'] },
  { word: 'PHONE', definition: 'A device used to communicate by voice over distances.', synonyms: ['mobile', 'cell', 'handset'] },
  { word: 'TOUCH', definition: 'To come into physical contact with something.', synonyms: ['feel', 'tap', 'brush'] },
  { word: 'SCORE', definition: 'To gain points in a game or contest.', synonyms: ['points', 'tally', 'mark'] },
  { word: 'SHARP', definition: 'Having a thin edge or point that can cut.', synonyms: ['keen', 'acute', 'pointed'] },
  { word: 'RADIO', definition: 'An electronic device that transmits and receives audio signals via electromagnetic waves.', synonyms: ['receiver', 'broadcast', 'wave'] },
  { word: 'SPEAK', definition: 'To utter words or communicate vocally.', synonyms: ['talk', 'chat', 'voice'] },
  { word: 'SOUND', definition: 'Vibrations that travel through the air to be heard.', synonyms: ['noise', 'tone', 'audio'] },
  { word: 'ALARM', definition: 'A warning device that makes a loud noise.', synonyms: ['alert', 'warning', 'signal'] },
  { word: 'CHEER', definition: 'To shout approval or support.', synonyms: ['applaud', 'encourage', 'hail'] },
  { word: 'CLOTH', definition: 'A material made by weaving threads.', synonyms: ['fabric', 'textile', 'material'] },
  { word: 'DRESS', definition: 'A one-piece garment for a woman or girl.', synonyms: ['gown', 'frock', 'attire'] },
  { word: 'STARE', definition: 'To look at something with fixed eyes.', synonyms: ['gaze', 'ogle', 'peer'] },
  { word: 'DRINK', definition: 'To take liquid into the mouth and swallow.', synonyms: ['sip', 'quench', 'gulp'] },
  { word: 'SPLIT', definition: 'To divide or cause to divide into parts.', synonyms: ['divide', 'separate', 'cleave'] },
  { word: 'GUIDE', definition: 'To lead or direct someone\'s way.', synonyms: ['lead', 'escort', 'pilot'] },
  { word: 'PEACE', definition: 'A state of tranquility or quiet.' , synonyms: ['calm', 'harmony', 'tranquility'] },
  { word: 'VALUE', definition: 'The worth or importance of something.', synonyms: ['worth', 'merit', 'price'] },
  { word: 'BEANS', definition: 'Seeds from certain plants used as food.', synonyms: ['legume', 'pulse', 'pea'] },
  { word: 'GIANT', definition: 'A being of great size or stature.', synonyms: ['titan', 'colossus', 'behemoth'] },
  { word: 'PAPER', definition: 'A material used for writing or packaging.', synonyms: ['sheet', 'page', 'parchment'] },
  { word: 'FORGE', definition: 'To shape metal by heating and hammering.', synonyms: ['mold', 'form', 'hammer'] },
  { word: 'CHARM', definition: 'An object believed to have magical powers.', synonyms: ['amulet', 'talisman', 'trinket'] },
  { word: 'UNITY', definition: 'The state of being one or in agreement.', synonyms: ['union', 'oneness', 'harmony'] },
  { word: 'RELAX', definition: 'To become less tense or anxious.', synonyms: ['rest', 'unwind', 'loosen'] },
  { word: 'GRACE', definition: 'Smoothness and elegance of movement.', synonyms: ['elegance', 'poise', 'finesse'] },
  { word: 'POWER', definition: 'The ability to do something or act.', synonyms: ['strength', 'force', 'might'] },
  { word: 'GREEN', definition: 'The color of growing grass and leaves.', synonyms: ['verdant', 'emerald', 'jade'] },
  { word: 'BLIND', definition: 'Unable to see.', synonyms: ['sightless', 'unable', 'unseeing'] },
  { word: 'MARCH', definition: 'To walk in a deliberate, uniform manner.', synonyms: ['parade', 'stride', 'step'] },
  { word: 'BLINK', definition: 'To close and open the eyes quickly.', synonyms: ['wink', 'flutter', 'twinkle'] },
  { word: 'BLEND', definition: 'To mix two or more substances together.', synonyms: ['mix', 'combine', 'merge'] },
  { word: 'CHASE', definition: 'To pursue in order to catch.', synonyms: ['pursue', 'follow', 'hunt'] },
  { word: 'DRAMA', definition: 'A play for theater, radio, or television.', synonyms: ['play', 'theater', 'performance'] },
  { word: 'FLAME', definition: 'The hot, glowing gas from a fire.', synonyms: ['fire', 'blaze', 'cinder'] },
  { word: 'SCOPE', definition: 'The range of view or activity.', synonyms: ['range', 'extent', 'purview'] },
  { word: 'TRACE', definition: 'To find or discover by investigation.', synonyms: ['track', 'follow', 'detect'] },
  { word: 'PHASE', definition: 'A distinct period or stage in a process.', synonyms: ['stage', 'period', 'moment'] },
  { word: 'EVOKE', definition: 'To bring or recall a feeling to the mind.', synonyms: ['elicit', 'conjure', 'induce'] },
  { word: 'QUERY', definition: 'A question or inquiry.', synonyms: ['question', 'inquiry', 'probe'] },
  { word: 'HUMOR', definition: 'The quality that makes something funny.', synonyms: ['wit', 'comedy', 'fun'] },
  { word: 'SALAD', definition: 'A cold dish of mixed vegetables or fruits.', synonyms: ['greens', 'mix', 'dish'] },
  { word: 'BLUFF', definition: 'To deceive or trick by boldness.', synonyms: ['deceive', 'mislead', 'dupe'] },
  { word: 'FLAIR', definition: 'A natural talent or instinctive aptitude.', synonyms: ['talent', 'knack', 'gift'] },
  { word: 'EMBED', definition: 'To fix firmly in a surrounding mass.', synonyms: ['implant', 'insert', 'enclose'] },
  { word: 'ALERT', definition: 'Quick to notice and respond to changes.', synonyms: ['vigilant', 'watchful', 'attentive'] },
  { word: 'VAPOR', definition: 'A substance diffused or suspended in the air.', synonyms: ['mist', 'gas', 'aerosol'] },
];

export default wordBank;