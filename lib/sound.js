define(["require", "exports"], function (require, exports) {
    "use strict";
    var Channel = (function () {
        function Channel(audioEl) {
            this.audioEl = [document.body.appendChild(audioEl)];
            for (var i = 0; i < Channel.channelMax; i++) {
                this.audioEl.push(audioEl.cloneNode(true));
            }
            this.index = this.audioEl.length;
        }
        return Channel;
    }());
    Channel.channelMax = 50;
    var SoundClass = (function () {
        function SoundClass() {
            var _this = this;
            this.shortHighBeep = new Audio('../res/beep-short.mp3');
            this.hitFartSound = new Audio('../res/fart-hit-em.mp3');
            this.hitBulletSound = new Audio('../res/hit-sound-em.mp3');
            this.playShortHighBeep = function () {
                _this.incrementChannel(_this.shortHighBeepChannel);
                _this.shortHighBeepChannel.audioEl[_this.shortHighBeepChannel.index].play();
            };
            this.playHitFartSound = function () {
                _this.incrementChannel(_this.hitFartSoundChannel);
                _this.hitFartSoundChannel.audioEl[_this.hitFartSoundChannel.index].play();
            };
            this.playHitBulletSound = function () {
                _this.incrementChannel(_this.hitBulletSoundChannel);
                _this.hitBulletSoundChannel.audioEl[_this.hitBulletSoundChannel.index].play();
            };
            this.incrementChannel = function (ch) {
                if (ch.index >= Channel.channelMax)
                    ch.index = 0;
                else
                    ch.index += 1;
            };
            this.shortHighBeep.load();
            this.hitFartSound.load();
            this.hitBulletSound.load();
            this.shortHighBeepChannel = new Channel(this.shortHighBeep);
            this.hitFartSoundChannel = new Channel(this.hitFartSound);
            this.hitBulletSoundChannel = new Channel(this.hitFartSound);
        }
        return SoundClass;
    }());
    exports.Sound = new SoundClass();
});
//# sourceMappingURL=sound.js.map