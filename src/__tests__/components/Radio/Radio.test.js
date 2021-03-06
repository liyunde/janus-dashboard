/* eslint-env jest */
import React from 'react'
import { createStore } from 'redux'

import { wrap } from '../../../utils/createTestForm'
import Radio from '../../../components/Radio/Radio'

const initialValues = {
  'mock-name': ''
}

const store = createStore(() => ({
  form: {
    mockForm: {
      values: initialValues
    }
  }
}))

describe('Radio component', () => {
  const requiredProps = {
    name: 'mock-name',
    id: 'mock-id',
    input: {
      checked: true
    }
  }

  it('renders correctly', () => {
    const tree = wrap(store)(initialValues)(
      <Radio
        {...requiredProps}
      />
    ).toJSON()

    expect(tree).toMatchSnapshot()
  })
})
