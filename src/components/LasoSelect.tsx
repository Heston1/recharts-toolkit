import React from 'react';
import usePrevious from '../utils/usePrevious';

export const LasoSelect  = (props: any) => {
    const {setSelectState, selectCoords, setYAxisDomain, setXAxisDomain, setSelectCoords, onSelected} = props;
    const prev = usePrevious(selectCoords) //use prev to avoid re-render
    
    React.useEffect(() => {
        if (selectCoords != null && selectCoords != prev && selectCoords.type == "laso") {
            onSelected && onSelected(selectCoords)
            setSelectCoords(null); //reset coords
        }
    }, [selectCoords])

    //TODO change icon
    return (
        <svg onClick={(e: any) => {setSelectState('laso')}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="rgb(102, 102, 102)" viewBox="0 0 1031 1000">
            <path d="m1018 538c-36 207-290 336-568 286-277-48-473-256-436-463 10-57 36-108 76-151-13-66 11-137 68-183 34-28 75-41 114-42l-55-70 0 0c-2-1-3-2-4-3-10-14-8-34 5-45 14-11 34-8 45 4 1 1 2 3 2 5l0 0 113 140c16 11 31 24 45 40 4 3 6 7 8 11 48-3 100 0 151 9 278 48 473 255 436 462z m-624-379c-80 14-149 48-197 96 42 42 109 47 156 9 33-26 47-66 41-105z m-187-74c-19 16-33 37-39 60 50-32 109-55 174-68-42-25-95-24-135 8z m360 75c-34-7-69-9-102-8 8 62-16 128-68 170-73 59-175 54-244-5-9 20-16 40-20 61-28 159 121 317 333 354s407-60 434-217c28-159-121-318-333-355z" transform="matrix(1 0 0 -1 0 850)"></path>
        </svg>
    );
}

