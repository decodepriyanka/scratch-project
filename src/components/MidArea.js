import React, { memo, useState } from "react";

const MidArea = memo(({ handlePlay, replayActions }) => {
  const [n, setN] = useState("");
  const [isReplayEnabled, setIsReplayEnabled] = useState(false);

  const handleNChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setN(value);
      setIsReplayEnabled(true);
    } else {
      setIsReplayEnabled(false);
    }
  };

  return (
    <div id="mid-area" className="flex-1 h-full overflow-auto ">
      <div className="flex justify-around items-center w-4/5">
        <button
          onClick={handlePlay}
          className="my-2 bg-green-500 p-1 cursor-pointer rounded h-12 w-20 text-white"
        >
          PLAY
        </button>
        <button
          onClick={() => replayActions(n)}
          className="my-2 bg-green-500 p-1 cursor-pointer rounded h-12 w-20 text-white"
          disabled={!isReplayEnabled}
        >
          REPLAY
        </button>
        <input
          type="number"
          value={n}
          onChange={handleNChange}
          className="my-2 p-1 h-12 w-60 text-center border-2 rounded"
          placeholder="Enter Nth action for replay"
        />
      </div>
    </div>
  );
});

export default MidArea;
