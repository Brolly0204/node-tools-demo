const rabbit = '兔子'
const turtle = '乌龟'

const start = '|'
const end = '》'
const pad = '.'
const speed = 1
const steps = 50
const stopAt = 42

let stoped = false
let t = 0
let timer

// 兔子距离终点
const getRabbitLastSteps = () => {
  return steps - t * speed * 3
}

// 乌龟距离终点
const getTurtleLastSteps = () => {
  return steps - t * speed
}

// 兔子停在stopAt后 计算龟距离兔子所在处间距
const getGapSteps = () => {
  return stopAt - t * speed
}

// 初始赛道状态
const checkRaceInitState = () => {
  return `${rabbit}${turtle}${start}${pad.repeat(steps)}${end}`
}

// 情况一 计算兔子领先时的赛道状态
const checkRaceState = () => {
  return `${start}${pad.repeat(t * speed)}${turtle}${pad.repeat(t * speed * 2)}${rabbit}${pad.repeat(getRabbitLastSteps())}${end}`
}

// 情况二 计算兔子停下来时的赛道实时状态
const checkBackRaceState = () => {
  if (getGapSteps() <= 0) { // 龟超过兔子 兔子停在了stopAt处 追上兔子或超过了兔子
    if (getTurtleLastSteps() === 0) { // 乌龟到达终点
      return `${start}${pad.repeat(stopAt)}${rabbit}${pad.repeat(steps - stopAt)}${end}${turtle}`
    } else {
      return `${start}${pad.repeat(stopAt)}${rabbit}${pad.repeat(t * speed - stopAt)}${turtle}${pad.repeat(getTurtleLastSteps())}${end}`
    }
  } else { //龟没有超过兔子时 龟还没有到达 兔子已经停下来的位置stopAt
    // 兔子停下来里
    return `${start}${pad.repeat(t * speed)}${turtle}${pad.repeat(getGapSteps())}${rabbit}${pad.repeat(steps - stopAt)}${end}`
  }
}

const wait = (sec) => new Promise(resolve => setTimeout(resolve, sec))

const chalkWorker = require('chalk-animation')
const initState = checkRaceInitState()
// 渲染初始状态
const racing = chalkWorker.rainbow(initState)

// 更新轨迹状态
const updateRaceTrack = (state) => {
  racing.replace(state)
}

const interval = 150
const race = () => {
  timer = setInterval(() => {
    // 判断兔子是否停下了
    if (!stoped) {
      if (getRabbitLastSteps() <= (steps - stopAt)) {
        stoped = true
      }
    }

    if (stoped) {
      let state = checkBackRaceState()
      // console.log(state)
      updateRaceTrack(state)
      if (getTurtleLastSteps() === 0) {
        clearInterval(timer)
        wait(interval).then(() => racing.stop())
        return
      }
    } else {
      let state = checkRaceState()
      updateRaceTrack(state)
    }
    t++
  }, interval)
}

wait(200).then(() => {
  race()
})
