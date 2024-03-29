import styles from './style.module.scss';

export default function LegalPage() {
  return (
    <div id="legal" className={styles.legal}>
      <div className={styles.container}>
        <h1>Mentions légales</h1>
        <h2 className={styles.articleTitle}>Propriétaire et hébergeur du site</h2>
        <p>
          Le site web EtuUTT est développé, maintenu et hébergé par :<br />
          <br />
          ASS UTT NET GROUP, association loi 1901
          <br />
          N° RNA : W103000699
          <br />
          N° d'immatriculation RCS : 500164249
          <br />
          12 rue Marie Curie, 10000 Troyes
          <br />
          03 25 71 85 50
          <br />
          ung@utt.fr
          <br />
          Directeur de la publication : Alban Souchard de Lavoreille
        </p>
        <h2 className={styles.articleTitle}>Collecte des données</h2>
        <p>
          Le site collecte certaines données personnelles renseignées par l’Utilisateur sur le site telles que le nom et
          le prénom. Ces données ne seront en aucun cas échangées, distribuées ou vendues à un tiers sans l'accord
          explicite de l'Utilisateur. L'Utilisateur peut, à tout moment, accorder ou révoquer son accord pour partager
          ses données avec les autres utilisateurs du site.
          <br />
          En vertu de la loi Informatique et Libertés, en date du 6 janvier 1978, l'Utilisateur dispose d'un droit
          d'accès, de rectification, de suppression et d'opposition de ses données personnelles. L'Utilisateur peut
          exercer ce droit directement en effectuant une demande par mail à l’adresse{' '}
          <a href="mailto:ung@utt.fr">ung@utt.fr</a>.
          <br />
          Le responsable du traitement des données est Guillaume ETHEVE.
          <br />
          L’équipe technique, les administrateurs, et les modérateurs du site pourront accéder aux données personnelles
          de l'Utilisateur, sans nécessiter l'autorisation de l'utilisateur de partager ses données personnelles avec
          les autres utilisateurs du site.
          <br />
          Les modérateurs du site sont désignés par l'UNG. L'UNG ne peut être tenu responsable des actions des
          modérateurs du site. L'UNG doit cependant s'assurer, dans les limites du raisonnable, que les modérateurs sont
          des personnes de confiance et respecteront la vie privée des utilisateurs.
          <br />
          Ces données seront conservées jusqu'à ce que l'Utilisateur décide de les supprimer, ou qu'il ait terminé ses
          études à l'Université de Technologie de Troyes et n'ait pas demandé la conservation de son compte.
        </p>
        <h2 className={styles.articleTitle}>Informations relatives aux cookies</h2>
        <p>
          Nous utilisons des cookies afin d'obtenir des statistiques sur notre site web. Ces informations ne seront en
          aucun cas vendues, échangées ou données. Ces cookies sont anonymisés. Afin d'assurer le fonctionnement du
          service à l'utilisateur authentifié, des cookies de session sont inscrits sur le navigateur lors de
          l'authentification sur le site. Ceux-ci ont pour seule fonction d'assurer la persistance de la session
          authentifiée de l'utilisateur. Ils sont détruits lors de la déconnexion ou à son expiration. Conformément à la
          directive européenne 2009/136/CE, ces cookies sont indispensables à la fourniture du service sollicité. Vous
          avez la possibilité d'accepter ou refuser ces cookies. Sans ces cookies, vous n'aurez pas accès aux
          fonctionnalités de connexion automatique.
        </p>
        <h2 className={styles.articleTitle}>Propriété intellectuelle</h2>
        <p>
          Le contenu du site internet reste la propriété de l'association ASS UTT NET GROUP, seul titulaire des droits
          de propriété intellectuelle sur ce contenu. Les utilisateurs s'engagent à ne faire aucun usage de ce contenu ;
          toute reproduction totale ou partielle de ce contenu, sans l'autorisation explicite de l'Editeur, est
          strictement interdite et est susceptible de constituer un délit de contrefaçon. Les utilisateurs peuvent
          toutefois s'inspirer du code source, disponible publiquement sur notre page GitHub.
        </p>
        <h2 className={styles.articleTitle}>Données personnelles</h2>
        <p>
          Chaque utilisateur du site web a un droit permanent d'accès et de rectification sur toutes les données le
          concernant, conformément aux textes européens et aux lois nationales en vigueur. Il vous suffit d'en faire la
          demande par courrier électronique (ung@utt.fr).
        </p>
      </div>
    </div>
  );
}
