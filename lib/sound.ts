/*
  The problem with JavaScript audio handling is that it by default queues the
  sounds that are played, instead trying to play the sounds over one another.
  Using different channels, however, such an obstacle is circumvented.
 */
class Channel {
  static channelMax: number = 50;

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

  /*
    Select the new channel for the sound, then play the sound. There doesn't
    seem to be a downside to having a lot of sound channels, but regardless the
    amount of channels can change by changing Channel.channelMax.
   */
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

// I don't want to have to create a new SoundClass for every sound, so let's
// just simply export a variable and use that for everything. Otherwise, Useless
// sound channels would be made and we don't want that.
export const Sound = new SoundClass();
