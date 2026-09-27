import type { Cue } from '../types'

/** 基准朗读速度：每秒 4 个字符，再乘以该条角色语速 */
export const BASE_CHARS_PER_SECOND = 4

export interface CueTiming {
  /** 译文有效字符数（不计空白） */
  chars: number
  /** 预计读音耗时（秒） */
  estimated: number
  /** 当前时间轴可用时长（秒） */
  available: number
  /** 超时时长（秒），未超时为 0 */
  over: number
  isOverrun: boolean
}

export const countSpokenChars = (text: string): number => (text.match(/\S/g) ?? []).length

export const getCueTiming = (cue: Pick<Cue, 'target' | 'speed' | 'start' | 'end'>): CueTiming => {
  const chars = countSpokenChars(cue.target)
  const rate = BASE_CHARS_PER_SECOND * (cue.speed > 0 ? cue.speed : 1)
  const estimated = chars / rate
  const available = Math.max(0, cue.end - cue.start)
  const over = Math.max(0, estimated - available)
  return { chars, estimated, available, over, isOverrun: estimated > available }
}

/** 秒数按一位小数展示 */
export const formatSeconds = (seconds: number): string => {
  const rounded = Math.round(seconds * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}
