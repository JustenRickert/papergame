

class Channel {
  static channelMax: number = 5;

  audioEl: HTMLAudioElement[];
  index: number;

  constructor(audioEl: HTMLAudioElement) {
    this.audioEl = [<HTMLAudioElement>document.body.appendChild(audioEl)]
    for (let i = 0; i < Channel.channelMax; i++) {
      this.audioEl.push(<HTMLAudioElement>audioEl.cloneNode(true));
    }
    this.index = this.audioEl.length;
  }
}

class SoundClass {
  shortHighBeep: HTMLAudioElement = new Audio('../res/beep-short.mp3');
  hitFartSound: HTMLAudioElement = new Audio('../res/fart-hit-em.mp3');
  hitBulletSound: HTMLAudioElement = new Audio('../res/hit-sound-em.mp3');

  shortHighBeepChannel: Channel;
  hitFartSoundChannel: Channel;
  hitBulletSoundChannel: Channel;

  constructor() {
    this.shortHighBeep.load();
    this.hitFartSound.load();
    this.hitBulletSound.load();

    this.shortHighBeepChannel = new Channel(this.shortHighBeep);
    this.hitFartSoundChannel = new Channel(this.hitFartSound);
    this.hitBulletSoundChannel = new Channel(this.hitFartSound);
  }

  playShortHighBeep = (): void => {
    this.incrementChannel(this.shortHighBeepChannel);
    this.shortHighBeepChannel.audioEl[this.shortHighBeepChannel.index].play();
  }

  playHitFartSound = (): void => {
    this.incrementChannel(this.hitFartSoundChannel);
    this.hitFartSoundChannel.audioEl[this.hitFartSoundChannel.index].play();
  }

  playHitBulletSound = (): void => {
    this.incrementChannel(this.hitBulletSoundChannel);
    this.hitBulletSoundChannel.audioEl[this.hitBulletSoundChannel.index].play();
  }

  incrementChannel = (ch: Channel) => {
    if (ch.index >= Channel.channelMax)
      ch.index = 0;
    else
      ch.index += 1;
  }
}

export const Sound = new SoundClass();
