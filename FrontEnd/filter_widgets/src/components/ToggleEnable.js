import './ToggleEnable.css'


function ToggleEnable(props) {

    const [selectedValue, setSelectedValue] = [props.selectedUse, props.setSelectedUse]

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    return (
        <>
            <div className="ToggleEnable">
            <div className="ToggleEnable__label">
                <label>Enable</label>
                <input type="checkbox" checked={props.enabled} onChange={event=>props.setEnabled(event.target.checked)} />
            </div>
            </div>
        </>
    );
}

export default ToggleEnable;