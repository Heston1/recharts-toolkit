import React from 'react';
import { Customized } from 'recharts';
import { resolveAxis } from './helpers';
import { withFading } from './withFading';

let select_wasMoved = false;
const SelectionUtil = (selectionProps: any)  => {
    //TODO handle padding/margin, other offsets
    return <Customized 
        component={
            (props: any) => {
                const [start, setStart] = React.useState(null);
                const [end, setEnd] = React.useState(null);
                const [path, setPath] = React.useState("");
                const [vYmap, setVYMAP] = React.useState([])
                const [vXmap, setVXMAP] = React.useState([])

                const onMouseDown = (e: any) => {
                    setStart(null); setEnd(null);
                    const bbox = e.target.getBoundingClientRect();
                   
                    setStart({x: e.clientX - selectionProps.offsetLeft, y: e.clientY - bbox.top + props.yAxisMap[0].y}); 
                    
                    select_wasMoved = true;
                }

                const onMouseMove = (e: any) => {
                    if (select_wasMoved) {
                        const bbox = e.target.getBoundingClientRect();

                        setEnd({x: e.clientX - selectionProps.offsetLeft, y: e.clientY - bbox.top + props.yAxisMap[0].y});
                    }
                }

                const onMouseUp = (e: any) => {
                    const bbox = e.target.getBoundingClientRect();

                    setEnd({x: e.clientX - selectionProps.offsetLeft, y: e.clientY - bbox.top + props.yAxisMap[0].y});

                    select_wasMoved = false;

                    selectionProps?.setSelectState(null);
                    
                    const x1 = start.x < end.x ? start.x : end.x;
                    const y1 = start.y < end.y ? start.y : end.y;
                    const x2 = start.x > end.x ? start.x : end.x;
                    const y2 = start.y > end.y ? start.y : end.y;

                    if (selectionProps.mode == "zoom" || selectionProps.mode == null) {
                        
    
                        const [yA1, yA2] = resolveAxis(props, selectionProps.yAxisDomain);
                        const [xA1, xA2] = resolveAxis(props, selectionProps.xAxisDomain);
    
                        selectionProps?.onCoordChange({
                            type: selectionProps.mode,
                            yDomain: [
                                (yA2 - ( (yA2 - yA1) * (y2 - props.yAxisMap[0].y)/(props.yAxisMap[0].height) ) ) ,
                                (yA2 - ( (yA2 - yA1) * (y1 - props.yAxisMap[0].y)/(props.yAxisMap[0].height) ) ) ,
                            ],
                            xDomain: [
                                (xA1 - ( (xA1 - xA2) * (x1 - props.xAxisMap[0].x)/(props.xAxisMap[0].width) ) ) ,
                                (xA1 - ( (xA1 - xA2) * (x2 - props.xAxisMap[0].x)/(props.xAxisMap[0].width) ) ) ,
                            ]
                        })
                    }
                    else if (selectionProps.mode == "select") {
                        //return the same as recharts tooltips api
                        selectionProps?.onCoordChange({
                            type: selectionProps.mode,
                            selectedPoints: props.formattedGraphicalItems
                                .reduce((acc: any, items: any) => acc.concat(items.props.points), [])
                                .filter((point: any) => {
                                    if (point.x >=  x1 && point.x <= x2 && point.y >= y1 && point.y <= y2) {
                                        return point;
                                    }
                                })
                        })
                    }
                    
                }

                const onLasoMouseDown = (e: any) => {
                    select_wasMoved = true;
                    setPath("");
                    setVYMAP([]);
                    setVXMAP([]);

                    const bbox = e.target.getBoundingClientRect();
                    const x = e.clientX - selectionProps.offsetLeft, y = e.clientY - bbox.top + props.yAxisMap[0].y
                    setPath(`M${x},${y}`)
                }
                const onLasoMouseMove = (e: any) => {
                    if (select_wasMoved) {
                        const bbox = e.target.getBoundingClientRect();
                        const x = e.clientX - selectionProps.offsetLeft, y = e.clientY - bbox.top + props.yAxisMap[0].y
                        let newPath = path;
                        if (path.substring(path.length - 1, path.length) == "Z") {
                            newPath = path.substring(0, path.length - 1) 
                        }
                        setPath(newPath + `L${x},${y}Z`);
                        setVXMAP(vXmap.concat([x]))
                        setVYMAP(vYmap.concat([y]))
                    }
                }
                const onLasoMouseUp = (e: any) => {
                    select_wasMoved = false;

                    //https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
                    //n is the number of points in the polygon, a ray is cast between px,py from the x,y position, 
                    //each time the ray intersects the polygon c switches indicating inside or outside
                    const isInPolygon = (n: number, px: any, py: any, x: number, y: number) => {
                        let i: any, j: any = n-1, c = false;
                        for (i = 0; i < n; j = i++) {
                            if (((py[i]>y) != (py[j]>y)) &&
                                    (x < (px[j]-px[i]) * (y-py[i]) / (py[j]-py[i]) + px[i])) {
                                c = !c
                            }
                            
                        }
                        return c;
                    }
                    selectionProps?.onCoordChange({
                        type: 'laso',
                        selectedPoints: props.formattedGraphicalItems
                            .reduce((acc: any, items: any) => acc.concat(items.props.points), [])
                            .filter((point: any) => {
                                return isInPolygon(vXmap.length, vXmap, vYmap, point.x, point.y);
                            })
                    });
                }

                if (selectionProps.mode == "laso") {
                    return (
                        <g>
                            <path
                                d={path}
                                style={{
                                    strokeDasharray: "3,3",
                                    stroke: "black", 
                                    strokeWidth: 1,
                                    strokeOpacity: 1,
                                    fillOpacity: 0.1,
                                }}
                            />
                            <rect 
                                onMouseDown={onLasoMouseDown}
                                onMouseMove={onLasoMouseMove}
                                onMouseUp={onLasoMouseUp}
                                x={props.yAxisMap[0].width + props.yAxisMap[0].x} 
                                y={props.yAxisMap[0].y} 
                                width={props.xAxisMap[0].width} 
                                height={props.yAxisMap[0].height} 
                                style={{opacity: 0, cursor: 'crosshair'}}
                            />
                        </g>
                    )
                }

                if (selectionProps.mode == "select") {
                    return (
                        <g>
                            {(start && end) && <rect 
                                x={start.x < end.x ? start.x : end.x}
                                y={start.y < end.y ? start.y : end.y}
                                width={start.x < end.x ? end.x-start.x : start.x-end.x}
                                height={start.y < end.y ?  end.y-start.y : start.y-end.y}
                                style={{
                                    strokeDasharray: "3,3",
                                    stroke: "black", 
                                    strokeWidth: 1,
                                    strokeOpacity: 1,
                                    fill: 'none',
                                }}
                            />}
                            <rect 
                                onMouseDown={onMouseDown}
                                onMouseMove={onMouseMove}
                                onMouseUp={onMouseUp}
                                x={props.yAxisMap[0].width + props.yAxisMap[0].x} 
                                y={props.yAxisMap[0].y} 
                                width={props.xAxisMap[0].width} 
                                height={props.yAxisMap[0].height} 
                                style={{opacity: 0, cursor: 'crosshair'}}
                            />
                        </g>
                    )
                }

                if (selectionProps.mode == "zoom" || selectionProps.mode == null) {
                    return (
                        <g>
                            <mask id="selection_mask">
                                <rect 
                                    x={props.yAxisMap[0].width + props.yAxisMap[0].x} 
                                    y={props.yAxisMap[0].y} 
                                    width={props.xAxisMap[0].width} 
                                    height={props.yAxisMap[0].height} 
                                    fill="white" 
                                />
    
                                {(start && end) && 
                                    <rect 
                                        x={start.x < end.x ? start.x : end.x}
                                        y={start.y < end.y ? start.y : end.y}
                                        width={start.x < end.x ? end.x-start.x : start.x-end.x}
                                        height={start.y < end.y ?  end.y-start.y : start.y-end.y}
                                        fill="black"
                                    />
                                }
                            </mask>
                            <rect 
                                onMouseDown={onMouseDown}
                                onMouseMove={onMouseMove}
                                onMouseUp={onMouseUp}
                                x={props.yAxisMap[0].width + props.yAxisMap[0].x} 
                                y={props.yAxisMap[0].y} 
                                width={props.xAxisMap[0].width} 
                                height={props.yAxisMap[0].height} 
                                style={{opacity: select_wasMoved ? 0.3 : 0, cursor: 'crosshair'}}
                                mask="url(#selection_mask)" 
                            />
                           
                        </g>
                    )
                }
            }
        } 
    /> 
}
export default SelectionUtil;