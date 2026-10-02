window.ADCS_SITE = {
  repositoryUrl: "https://github.com/freetown113/ADCS_RL",
  contactUrl: "freetown113@gmail.com",
  snapshotUrl: "https://github.com/freetown113/ADCS_RL/tree/main",

  // Code placeholders appear in context. Replace each empty string with a
  // commit-pinned GitHub line URL, e.g. .../blob/FULL_SHA/path/file.py#L40-L80.
  // Set false before publishing if you prefer to hide unfinished references.
  showPendingCodeLinks: true,
  codeLinks: {
    mission: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/mission.py",
    guidance: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/guidance.py",
    sensors: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/sensors.py",
    estimator: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/estimator.py",
    control: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/control.py",
    actuators: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/magnetorquer.py",
    fdir: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/fdir.py",
    supervisor: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/supervisor.py",
    environment: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/env.py",
    training: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/train.py",
    imitation: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/imitation.py",
    network: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/network.py",
    curriculum: "",
    interfaces: "",
    evaluation: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/evaluate_checkpoint.py",
    sunPointing: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/guidance.py",
    groundTarget: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/guidance.py",
    scheduledSlew: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/guidance.py",
    nadirLvlh: "https://github.com/freetown113/ADCS_RL/blob/main/simulators/fdir/guidance.py"
  },

  // Put the actual B3 video in assets/, then set its relative path.
  // Results shows a labeled placeholder until a real recording is configured.
  demoVideo1: "./assets/gst_rp_update_0035250.mp4",     // assets/update_0009250.mp4
  demoPoster1: "",    // optional still image
  demoCaption1: "ground-station tracking · 90 seconds of simulation, shown at approximately 4× speed. One recorded run.",

  demoVideo2: "./assets/sp_update_0018750_control.mp4",     // assets/update_0009250.mp4
  demoPoster2: "",    // optional still image
  demoCaption2: "Sun pointing · 90 seconds of simulation, shown at approximately 4× speed. One recorded run.",

  // Up to three matched checkpoints. One player is switched between them;
  // no autoplay. Put literal entries like this into the array when available:
  // { label: "Early", src: "assets/early.mp4", poster: "assets/early.jpg",
  //   checkpoint: "update 0001000", conditions: "Same evaluation seed, initial state, target and fault schedule." }
  // Use genuine checkpoint IDs and conditions. A similar-looking clip is not
  // necessarily a matched evaluation.
  trainingClips: [],

  // One exported experiment figure; never an invented performance curve.
  resultFigure: {
    src: "", // assets/pointing-error-comparison.png
    alt: "",
    caption: "" // Controller names, units, conditions, seeds/trials, key finding.
  }
};
