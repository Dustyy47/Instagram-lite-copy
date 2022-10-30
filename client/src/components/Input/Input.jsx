import styles from './Input.module.scss'
import ValidationMessage from "../Auth/ValidationMessage";
import {useEffect, useState} from "react";

function Input({name, onChange, value, type, placeholder, className, isColumn, validator,forwardRef, ...props}) {

    const [showValidation,setShowValidation] = useState(false);

    const blur = ()=> {
        setShowValidation(true);
        if(props.onBlur)
            props.onBlur();
    }

    useEffect(()=>{
        validator?.validate('');
    },[])

    const change = (e) => {
        validator?.validate(e.target.value);
        onChange(e.target.value);
    }
    return (
        <div style={props.styleWrapper} className={styles.wrapper}>
            <ValidationMessage show={showValidation} errorsString={validator?.errors}/>
            <div className={styles.group}>
                <label style={props.styleLabel} className={styles.label}
                >{props.children}<span>{name}</span></label>
                <input ref ={forwardRef} onBlur={blur} onFocus={props.onFocus} style={props.styleInput}
                       onChange={change} value={value} type={type === "" ? "text" : type}
                       id={props.id}
                       autoComplete="on" className={styles.input} placeholder={placeholder}/>
            </div>

        </div>
    );
}

export default Input;