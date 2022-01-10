import React from 'react';

export const Ruler  = (props: any) => {
    const {setEnableReferenceLines, enableReferenceLines} = props;
    const selected = false ? "#22b5bf" : "rgb(102, 102, 102)"; //TODO

    //TODO change icon
    return (
        <svg onClick={(e: any) => {}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill={selected} viewBox="0 0 16 16">
            <path d="M1 0a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5v-1H2v-1h4v-1H4v-1h2v-1H2v-1h4V9H4V8h2V7H2V6h4V2h1v4h1V4h1v2h1V2h1v4h1V4h1v2h1V2h1v4h1V1a1 1 0 0 0-1-1H1z"/>
        </svg>
    );
}