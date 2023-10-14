import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import SummaryCard from '../SummaryCard.vue'

describe('SummaryCard', () => {
  it('renders properly', () => {
    const wrapper = mount(SummaryCard, {
      props: {
        icon: 'mdi-home',
        tile_color: 'orange',
        title: '報告数',
        data: '100',
        unit: '件'
      }
    })

    // todo: titleのテストはどうやれば良いかしら？
    expect(wrapper.text()).toContain('100')
    expect(wrapper.text()).toContain('件')
  })
})
