import {
  IDashboardCard,
  setDashboardCard,
} from '@/store/slices/dashboardCardSlice';
import { RootState } from '@/store/store';
import { CheckOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Flex,
  message,
  Skeleton,
  Switch,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import useDashboardCards from './useDashboardCards';

const ControlsInDrawer = () => {
  const cards = useSelector((store: RootState) => store.dashboardCardSlice);
  const dispatch = useDispatch();
  const dashboardCardsArray = useDashboardCards();
  const [isDraggable, setIsDraggable] = useState(false);
  const { t } = useTranslation();

  const handleDragEnd = (result: DropResult) => {
    const tempCards = Array.from(cards);
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    const [card] = tempCards.splice(result.source.index, 1);
    tempCards.splice(result.destination.index, 0, card);
    dispatch(setDashboardCard(tempCards));
  };

  useEffect(() => {
    if (isDraggable) {
      message.info(t('components.message.drag_drop_info'));
    }
  }, [isDraggable]);

  if (dashboardCardsArray.length === 0 || cards.length === 0)
    return <Skeleton active />;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Flex vertical gap={10}>
        <Flex gap={12} onClick={e => e.stopPropagation()}>
          <Typography.Text>
            {t('dashboard.dashboard_page.drag_cards_text')}
          </Typography.Text>
          <Switch value={isDraggable} onChange={val => setIsDraggable(val)} />
        </Flex>

        <Droppable droppableId="dashboard-cards" direction="vertical">
          {(provided, snapshot) => (
            <Flex
              vertical
              gap={16}
              className={`control-cards ${snapshot.isDraggingOver || isDraggable ? 'draggable' : ''}`}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {cards.map((card, index) => {
                const currentCard = dashboardCardsArray.find(
                  dashboardCard => dashboardCard.id === card.id
                );
                return (
                  <Draggable
                    key={currentCard?.id}
                    draggableId={currentCard?.id}
                    index={index}
                    isDragDisabled={!isDraggable}
                  >
                    {provided => (
                      <Card
                        className={`control-card ${currentCard.id}-card`}
                        hoverable
                        key={currentCard.id}
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <Flex
                          justify="space-between"
                          align="flex-start"
                          gap={10}
                          wrap
                        >
                          <Flex vertical gap={8}>
                            <div
                              className="control-icon"
                              style={{
                                background: `linear-gradient(${currentCard?.linearGradient})`,
                                height: 40,
                                width: 40,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '8px',
                              }}
                            >
                              {currentCard?.icon}
                            </div>
                            <Typography.Text strong>
                              {currentCard?.title}
                            </Typography.Text>
                          </Flex>
                          <Button
                            type={card.isAdded ? 'primary' : 'default'}
                            icon={
                              card.isAdded ? (
                                <CheckOutlined />
                              ) : (
                                <PlusCircleOutlined />
                              )
                            }
                            onClick={() => {
                              const newCard: IDashboardCard = {
                                ...card,
                                isAdded: !card.isAdded,
                              };
                              const newCards = [...cards];
                              newCards.splice(
                                newCards.findIndex(
                                  card => card.id === newCard.id
                                ),
                                1,
                                newCard
                              );
                              dispatch(setDashboardCard(newCards));
                              window.navigator.vibrate(200);
                            }}
                          >
                            {card.isAdded ? t('const.added') : t('const.add')}
                          </Button>
                        </Flex>
                      </Card>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </Flex>
          )}
        </Droppable>
      </Flex>
    </DragDropContext>
  );
};

export default ControlsInDrawer;
