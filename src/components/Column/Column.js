import React, { useState, useEffect, useCallback } from 'react'
import './Column.scss'

import Card from 'components/Card/Card'
import ConfirmModal from 'components/Common/ConfirmModal'
import { mapOrder } from 'utilities/sorts'
import { Container, Draggable } from 'react-smooth-dnd'
import { Dropdown, Form } from 'react-bootstrap'

import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { saveContentAfterPressEnter, selectAllInlineText } from 'utilities/contentEditable'

function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props
  const cards = mapOrder(column.cards, column.cardOder, 'id')

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const toggleShowConfirmModal = () => {
    setShowConfirmModal(!showConfirmModal)
  }

  const [columnTitle, setColumnTitle] = useState('')
  const handleColumnTitleChange = useCallback((e) => setColumnTitle(e.target.value), [])

  useEffect(() => {
    setColumnTitle(column.title)
  }, [column.title])

  const onConfirmModalAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      //remove column
      const newColumn = { ...column, _destroy: true }
      onUpdateColumn(newColumn)
    }
    toggleShowConfirmModal()
  }
  const handleColumnTitleBlur = () => {
    const newColumn = { ...column, title: columnTitle }
    onUpdateColumn(newColumn)
  }

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="column-title">
          <Form.Control
            size="sm"
            type="text"
            className="content-editTable"
            value={columnTitle}
            onChange={handleColumnTitleChange}
            onBlur={handleColumnTitleBlur}
            onKeyDown={saveContentAfterPressEnter}
            onClick={selectAllInlineText}
            onMouseDown={e => e.preventDefault()}
            spellCheck="false"
            // onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
          />
        </div>
        <div className="column-dropdown-action">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn"/>

            <Dropdown.Menu>
              <Dropdown.Item >Add Card...</Dropdown.Item>
              <Dropdown.Item onClick={toggleShowConfirmModal}>Remove column...</Dropdown.Item>
              <Dropdown.Item >Remove all card...</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          {...column.props}
          groupName="vl-column"
          orientation="vertical"
          onDrop= {dropResult => onCardDrop(column.id, dropResult)}
          getChildPayload={index => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview'
          }}
          dropPlaceholderAnimationDuration={200}
        >
          { cards.map((card, index) =>
            (
              <Draggable key={index}>
                <Card key={ index} card={ card }/>
              </Draggable>
            )
          )}
        </Container>
      </div>
      <footer>
        <div className="footer-actions">
          <i className="fa fa-plus icon"></i>
          Add another card
        </div>
      </footer>

      <ConfirmModal
        show= {showConfirmModal}
        onAction={onConfirmModalAction}
        title="Remove column"
        content=
          {`Are you sure you want to remove <strong>${column.title}</strong>!`}
      />
    </div>
  )
}

export default Column
