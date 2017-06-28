import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import cx from 'classnames'
import Menu from '../Menu'
import menuBarItems from './menuBarItems'
import * as GitActions from '../Git/actions'
import config from '../../config'

@connect(
  state => state,
  dispatch => bindActionCreators(GitActions, dispatch)
)
class MenuBar extends Component {
  static defaultProps = {
    items: menuBarItems
  }

  constructor (props) {
    super(props)
    this.state = { activeItemIndex: -1 }
  }

  activateItemAtIndex = (index, isTogglingEnabled) => {
    if (isTogglingEnabled && this.state.activeItemIndex == index) {
      this.setState({ activeItemIndex: -1 })
    } else {
      this.setState({ activeItemIndex: index })
    }
  }

  handleSwitch = () => {
    this.props.switchVersion()
  }

  activatePrevMenuItem = () => {
    let nextIndex = this.state.activeItemIndex - 1
    if (nextIndex < 0) nextIndex = 0
    this.activateItemAtIndex(nextIndex)
  }

  activateNextMenuItem = () => {
    let nextIndex = this.state.activeItemIndex + 1
    if (nextIndex >= this.props.items.length) nextIndex = this.props.items.length - 1
    this.activateItemAtIndex(nextIndex)
  }

  render () {
    const { items } = this.props
    return (
      <div className='menu-bar-container'>
        <ul className='menu-bar'>
          { items.map((menuBarItem, i) =>
            <MenuBarItem item={menuBarItem}
              isActive={this.state.activeItemIndex == i}
              shouldHoverToggleActive={this.state.activeItemIndex > -1}
              toggleActive={this.activateItemAtIndex}
              key={`menu-bar-${menuBarItem.name}`}
              index={i}
              state={this.props}
              activatePrevTopLevelMenuItem={this.activatePrevMenuItem}
              activateNextTopLevelMenuItem={this.activateNextMenuItem}
            />) }
        </ul>
        {config.isPlatform && (<div className='btn btn-xs btn-info' onClick={this.handleSwitch}>
          Switch to v1
        </div>)}
      </div>
    )
  }
}

const MenuBarItem = (props) => {
  const { item, isActive, shouldHoverToggleActive,
          toggleActive, index } = props
  const menuBarItem = item
  return (
    <li className={cx('menu-bar-item', menuBarItem.className)}>
      <div className={cx('menu-bar-item-container',
          { active: isActive }
        )}
        onClick={(e) => {
          e.stopPropagation()
          toggleActive(index, true)
          if (menuBarItem.onOpen) {
            if (!isActive) {
              menuBarItem.onOpen()
            }
          }
        }}
        onMouseEnter={(e) => { if (shouldHoverToggleActive) toggleActive(index) }}
      >
        {menuBarItem.name}
      </div>
      { isActive ?
          <Menu
            items={menuBarItem.items}
            className={cx('top-down to-right', { active: isActive })}
            deactivateTopLevelMenu={toggleActive.bind(null, -1)}
            activatePrevTopLevelMenuItem={props.activatePrevTopLevelMenuItem}
            activateNextTopLevelMenuItem={props.activateNextTopLevelMenuItem}
            state={props.state}
          />
      : null}
    </li>
  )
}

export default MenuBar
