import logo from "../../assets/img/userFooterLogo.png";
import styles from '../common/UserFooter.module.css';


function UserFooter() {
     return (
       <div className={styles.footer}>
         <img src={logo} className={styles.Logo} alt="Logo" />
   
         <div className={styles.Box}>
           <div className={styles.textBox}>회사소개</div>
           <div className={styles.textBox}>유튜브</div>
           <div className={styles.textBox}>오시는길</div>
         </div>
   
         <div className={styles.Box}>email : readioceo@gmail.com</div>
         <div className={styles.Box}>@Readio @BBmore @맛zip @Propick</div>
       </div>
     );
   }
   

export default UserFooter;