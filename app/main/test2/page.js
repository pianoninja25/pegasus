import moment from 'moment';
import React from 'react'

const Test = () => {
  const nowAsInt = moment();
  return (
    <div className='pt-20'>Test: {nowAsInt.valueOf()}</div>
  )
}

export default Test