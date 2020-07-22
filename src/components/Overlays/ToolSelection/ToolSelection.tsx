import React = require("react")
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ControlCameraIcon from '@material-ui/icons/ControlCamera';
import SelectAllIcon from '@material-ui/icons/SelectAll';
import BlurOffIcon from '@material-ui/icons/BlurOff';
import './ToolSelection.scss'
import { connect } from 'react-redux'
import LinearScaleIcon from '@material-ui/icons/LinearScale';

const mapStateToProps = state => ({
    currentTool: state.currentTool
})

const mapDispatchToProps = dispatch => ({
    setCurrentTool: id => dispatch({
        type: 'SET_TOOL',
        tool: id
    })
})

export enum Tool {
    Default,
    Move,
    Grab,
    Crosshair
}

export function getToolCursor(tool: Tool) {
    switch (tool) {
        case Tool.Default:
            return 'default'
        case Tool.Move:
            return 'move'
        case Tool.Grab:
            return 'grab'
        case Tool.Crosshair:
            return 'crosshair'
    }
}

export var ToolSelection = connect(mapStateToProps, mapDispatchToProps)(function ({ currentTool, setCurrentTool, onChangeTool }) {
    return <div className="ToolSelectionParent">
        <ToggleButtonGroup
            style={{ pointerEvents: 'auto' }}
            size='small'
            value={currentTool}
            exclusive
            onChange={(e, newValue) => {
                setCurrentTool(newValue)
                onChangeTool(newValue)
            }}
            aria-label="text alignment"
        >
            <ToggleButton value={Tool.Default}>
                <SelectAllIcon />
            </ToggleButton>
            <ToggleButton value={Tool.Move}>
                <ControlCameraIcon />
            </ToggleButton>
            <ToggleButton value={Tool.Grab}>
                <BlurOffIcon />
            </ToggleButton>
            <ToggleButton value={Tool.Crosshair}>
                <LinearScaleIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    </div>
})