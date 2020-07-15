const chalkWorker = require('chalk-animation')

class Race {
  constructor (props = {}) {
    // 将传递进来的props的属性 挂载到this实例上
    Object.assign(this, props)
    ;[
      ['rabbit', '兔子'],
      ['turtle', '乌龟'],
      ['turtleStep', 0],
      ['rabbitStep', 0],
      ['start', '【Go】'],
      ['end', '【Yes】'],
      ['pad', '.'],
      ['speed', 1],
      ['steps', 50],
      ['stopAt', 42]
    ].forEach(ele => {
      const [key, value] = ele
      if (!(key in props)) {
        this[key] = value
      }
    })
    this.timer = null
  }

  // 获取比赛轨迹状态
  getRaceTrack () {
    const {
      start,
      end,
      pad,
      turtle,
      turtleStep,
      rabbit,
      rabbitStep,
      steps
    } = this

    // 初始状态
    if (!turtleStep && !rabbitStep) {
      return `${rabbit}${turtle}${start}${pad.repeat(steps)}${end}`
    }

    // 根据步数从小到大排序
    const [
      [minStr, minStep],
      [maxStr, maxStep]
    ] = [
      [rabbit, rabbitStep],
      [turtle, turtleStep]
    ].sort((a, b) => a[1] - b[1])

    // 拼接距离
    const prefix = `${pad.repeat((minStep || 1))}` // 起始位置距龟的距离
    const middle = `${pad.repeat(maxStep - minStep)}` // 两者之间距离
    const suffix = `${pad.repeat(steps - maxStep)}` // 距离终点

    // 拼接完整距离
    const _start = `${start}${prefix}${minStr}`
    const _end = suffix ? `${maxStr}${suffix}${end}` : `${end}${maxStr}`
    return `${_start}${middle}${_end}`
  }

  // 更新比赛轨迹状态
  updateRaceTrack (state, racing) {
    racing.replace(state)
  }

  // 更新步数
  updateSteps () {
    // 如果🐢到达里终点就直接结束
    if (this.turtleStep >= this.steps) return
    if (this.rabbitStep <= this.stopAt) {
      this.rabbitStep += (this.speed * 3)
      this.rabbitStep = Math.min(this.stopAt, this.rabbitStep)
    }
    this.turtleStep += (1 * this.speed)
  }

  // 开始比赛
  race () {
    const initState = this.getRaceTrack()
    const racing = chalkWorker.rainbow(initState, 1)
    let t = 0
    this.timer = setInterval(() => {
      if (t <= 6) {
        t++
        return
      }

      const state = this.getRaceTrack()
      this.updateRaceTrack(state, racing)
      this.updateSteps()
      if (this.turtleStep >= this.steps) {
        setTimeout(() => {
          clearInterval(this.timer)
          racing.stop()
        }, 300)
      }
    }, 150)
  }
}

const race = new Race({
  stopAt: ~~(Math.random() * 50) + 3
})
race.race()
