import { useState } from 'react'
import { Steps, Row, Col, Button } from 'uiw'
import styles from './index.module.less'
import './style.css'

// 每一项
const Step = (props) => {
  const { item, size } = props
  const [isPackup, setIsPackup] = useState(false)
  const titleNone = (time, text) => {
    return (
      <div className={styles.StepsLi}>
        <div className={styles.StepsLiTime}>{time}</div>
        <div className={styles.StepsLiText}>{text}</div>
      </div>
    )
  }
  return (
    <div className={styles.step}>
      <Row className={size && styles[`${size}`]}>
        <Col span="5">
          <div className={styles.stepLeft}>
            <div className={styles.title}>{item.date}</div>
            <div className={styles.But}>
              <Button
                basic
                type="light"
                icon={isPackup ? 'caret-down' : 'caret-up'}
                onClick={() => setIsPackup(!isPackup)}></Button>
            </div>
          </div>
        </Col>
        <Col span="1" className={styles.cable}>
          <div className={styles.line}></div>
        </Col>
        <Col span="18" className={size && `${size}`}>
          <div className={styles.stepRigHt}>
            <div
              className={`ShowStepsRigHtSteps ${
                isPackup ? 'StepsPackupRigHtSteps' : ''
              }`}>
              <Steps
                direction="vertical"
                progressDot
                status="error"
                current={item?.dayDynamics?.length}
                style={{ padding: '10px' }}>
                {item?.dayDynamics?.map((item, index) => (
                  <Steps.Step
                    key={index}
                    title={titleNone(item.time, item.text)}
                  />
                ))}
              </Steps>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Step
