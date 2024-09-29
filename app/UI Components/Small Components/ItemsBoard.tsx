import React from "react";
import ItemsCard from "./ItemsCard";

type ItemsBoardProps = {
  data: any;
  title: any;
  onChange: any;
};

const ItemsBoard: React.FC<ItemsBoardProps> = ({ data, title, onChange }) => {
  // Sort data (Might need useMemo)
  let sorted = [...data].sort((a, b) => a.order - b.order);

  const onDragEnterHandler = (e) => {
    e.preventDefault();
  };
  const onDragOverHandler = (e) => {
    e.preventDefault();
    if (e.target.className === "boardContentArea") {
      setTimeout(() => {
        e.target.className = "boardContentArea hovered";
      }, 0);
    }
  };
  const onDragLeaveHandler = (e) => {
    e.preventDefault();
    if (e.target.className === "boardContentArea hovered") {
      setTimeout(() => {
        e.target.className = "boardContentArea";
      }, 0);
    }
  };
  const onDropHandler = (e) => {
    let cardInfo = JSON.parse(e.dataTransfer.getData("cardInfo"));
    let targetCardId = e.target.id;
    onChange(cardInfo, targetCardId);
    if (e.target.className === "boardContentArea hovered") {
      setTimeout(() => {
        e.target.className = "boardContentArea";
      }, 0);
    }
  };

  // returns JSX - Render cards
  const renderCards = () => {
    return sorted.map((item) => (
      <ItemsCard key={`status-${item.id}`} id={item.id} title={item.title} />
    ));
  };

  return (
    <div className="board-col">
      <div className="list">
        <h4 className="list-title">{title}</h4>
        <div
          className="boardContentArea"
          onDragEnter={onDragEnterHandler}
          onDragOver={onDragOverHandler}
          onDragLeave={onDragLeaveHandler}
          onDrop={onDropHandler}
        >
          {renderCards()}
        </div>
        <a className="btn-list"></a>
      </div>
    </div>
  );
};

export default ItemsBoard;
