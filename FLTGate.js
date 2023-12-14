class FLTGate {
    constructor() {
        this.mode = 'default';
        this.trigger = {
            envelope: [],
            gradient: {
                startIn:  0,
                stopIn:   0,
                startOut: -1,
                stopOut:  -1
            },
            range: {
                start: 0,
                stop:  -1
            }
        };
        this.boundEvent = {
            success: function() {},
            fail:    function() {},
            finally: function() {}
        };
    }

    /**
     * 绑定事件
     * @param {String} event 事件名称
     * @param {Function} action 事件过程
     * @returns {Function} 事件过程
     */
    bind(event, action = function() {}) {
        return this.boundEvent[event] = action;
    }

    run() {
        let r = false;
        switch (this.mode) {
            case 'default':
            case 'range':
                r = this.rangeTest().state;
                break;

            case 'gradient':

                break;
        
            case 'envelope':

                break;

            default:
                break;
        }

        if (r) {
            this.boundEvent.success();
        } else {
            this.boundEvent.fail();
        }
        this.boundEvent.finally();
    }

    envelopeTest() {

    }

    setGradient(startIn, stopIn, startOut, stopOut) {
        if (startIn > stopIn || startOut > stopOut || stopIn > startOut) return;

        this.trigger.gradient.startIn  = startIn;
        this.trigger.gradient.stopIn   = stopIn;
        this.trigger.gradient.startOut = startOut;
        this.trigger.gradient.stopOut  = stopOut;

        return this.trigger.gradient;
    }

    gradientTest() {
        const   now       = new Date().getTime(),
                startIn   = this.trigger.gradient.startIn,
                stopIn    = this.trigger.gradient.stopIn,
                startOut  = this.trigger.gradient.startOut >= 0 ? this.trigger.gradient.startOut : Infinity,
                stopOut   = this.trigger.gradient.stopOut  >= 0 ? this.trigger.gradient.stopOut  : Infinity,
                inLength  = stopIn  - startIn,
                outLength = stopOut - startOut,
                inRate    = (now - startIn) / inLength,
                outRate   = 1 - ((now - startOut) / outLength),
                r         = Math.random();

        if (startIn > stopIn || startOut > stopOut || stopIn > startOut) {
            return {
                state: false,
                error: 'Illegal Input'
            };
        }

        let p = 0;
        if (now >= startIn ) p++;   // 1 = in
        if (now >= stopIn  ) p++;   // 2 = max
        if (now >= startOut) p++;   // 3 = out
        if (now >= stopOut ) p++;   // 4 = stop

        switch (p) {
            case 0:
            case 4:
                return {
                    state: false,
                    random: r,
                    rate: 0
                };

            case 2:
                return {
                    state: true,
                    random: r,
                    rate: 1
                };

            case 1:
                if (r < inRate) {
                    return {
                        state: true,
                        random: r,
                        rate: inRate
                    };
                }

                return {
                    state: false,
                    random: r,
                    rate: inRate
                };

            case 3:
                if (r < outRate) {
                    return {
                        state: true,
                        random: r,
                        rate: outRate
                    };
                }

                return {
                    state: false,
                    random: r,
                    rate: outRate
                };
        }
    }

    setRange(start = 0, stop = -1) {
        if (start > stop) return;

        this.trigger.range.start = start;
        this.trigger.range.stop = stop;

        return this.trigger.range;
    }

    rangeTest() {
        const   now   = new Date().getTime(),
                start = this.trigger.range.start,
                stop  = this.trigger.range.stop >= 0 ? this.trigger.range.stop : Infinity;
        if (start > stop) {
            return {
                state: false,
                error: 'Illegal Input'
            };
        }

        if (now >= start && now < stop) {
            return {
                state: true,
                now: now,
                start: start,
                stop: stop
            };
        } else {
            return {
                state: false,
                now: now,
                start: start,
                stop: stop
            };
        }
    }
}