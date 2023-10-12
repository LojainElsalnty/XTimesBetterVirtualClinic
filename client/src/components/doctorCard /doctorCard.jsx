// Styles
import styles from './doctorCard.module.css';


// Images

export const DoctorCard = ({ doctor, handleCardClick }) => {

    function capitalizeFirstLetters(name) {
        // Split the patients name string into an array of strings whenever a blank space is encountered
        const arr = name.split(" ");
        // Loop through each element of the array and capitalize the first letter.
        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        //Join all the elements of the array back into a string 
        //using a blankspace as a separator 
        return arr.join(" ");
    }

    return (
        <div className={styles['main-card-div']} onClick={() => handleCardClick(doctor.username)}>
            <div className={styles['card-pic-div']}>
                <div className={styles['main-card-img']}></div>
            </div>
            <div className={styles['card-info-div']}>
                <div className={styles['card-username-div']}><a className={styles['card-username-a']}><strong><span className={styles['card-span-info']}>Name: {capitalizeFirstLetters(doctor.name)}</span></strong></a></div>
                <div className={styles['card-email-div']}><a className={styles['card-email-a']}><strong><span className={styles['card-span-info']}>Email: {doctor.email}</span></strong></a></div>
                <div className={styles['card-mobile-div']}><a className={styles['card-mobile-a']}><strong><span className={styles['card-span-info']}>Date of birth: {doctor.dob }</span></strong></a></div>
            </div>
        </div>
    );
}