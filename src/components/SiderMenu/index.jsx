import { Link } from 'react-router-dom'
// import {Collapse} from 'uiw';
import { Icon } from 'uiw'

// const customPanelStyle = {
//   background: 'red',
//   borderRadius: 4,
//   marginBottom: 24,
//   border: 0,
//   overflow: 'hidden',
// };

export default function SiderMenu() {
  // const Panel = Collapse.Panel;
  // const stylSider = { background: '#484a4e', color: '#fff', lineHeight: `120px`, textAlign: 'center' }
  // const stylcollapse={background: '#484a4e', color: '#fff', textAlign: 'center'}

  return (
    <div>
      {/* 菜单
    <Link to="/project">项目</Link>
    <Link to="/company">公司</Link>  */}
      <div style={{ fontSize: '28px' }}>
        <Link to="/project">
          <Icon type="smile" />
        </Link>
        <div>
          <Link to="/company">
            <Icon type="frown" />
          </Link>
        </div>
        <div>
          <Icon type="meh" />
        </div>
      </div>
    </div>
  )
}
