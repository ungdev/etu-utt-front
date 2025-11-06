import Page from '@/components/utilities/Page';
import styles from './style.module.scss';

export default function LegalPage() {
  const env = process.env;
  return (
    <Page id="legal" className={styles.legal}>
      <div className={styles.container}>
        Cette page a été mise à jour le {env.NEXT_PUBLIC_LAST_TERMS_UPDATE}.<h1>Mentions légales</h1>
        <p>
          Le site web EtuUTT est développé, maintenu et hébergé par :<br />
          <br />
          {env.NEXT_PUBLIC_ASSOCIATION_NAME}, association loi 1901
          <br />
          N° RNA : {env.NEXT_PUBLIC_ASSOCIATION_RNA}
          <br />
          N° d'immatriculation RCS : {env.NEXT_PUBLIC_ASSOCIATION_RCS}
          <br />
          {env.NEXT_PUBLIC_ASSOCIATION_ADDRESS}
          <br />
          {env.NEXT_PUBLIC_ASSOCIATION_PHONE}
          <br />
          <a href={`mailto:${env.NEXT_PUBLIC_ASSOCIATION_EMAIL}`}>{env.NEXT_PUBLIC_ASSOCIATION_EMAIL}</a>
          <br />
          Directeur de la publication : {env.NEXT_PUBLIC_PUBLICATION_DIRECTOR}
        </p>
        <h1>Conditions Générales d'Utilisation (CGU)</h1>
        {/* <h2 className={styles.articleTitle}>Collecte des données</h2>
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
        </p> */}
        <h2 className={styles.articleTitle}>Propriété intellectuelle</h2>
        <p>
          Le contenu du site internet reste la propriété de l'association ASS UTT NET GROUP, seul titulaire des droits
          de propriété intellectuelle sur ce contenu. Les utilisateurs s'engagent à ne faire aucun usage de ce contenu ;
          toute reproduction totale ou partielle de ce contenu, sans l'autorisation explicite de l'Editeur, est
          strictement interdite et est susceptible de constituer un délit de contrefaçon. Les utilisateurs peuvent
          toutefois s'inspirer du code source, disponible publiquement sur notre page GitHub.
        </p>
        <h1>Politique de confidentialité</h1>
        <h2 className={styles.articleTitle}>1. Préambule</h2>
        <div>
          <p>La présente politique de confidentialité a pour but d’informer les utilisateurs du site :</p>
          <ul>
            <li>
              Sur la manière dont sont collectées leurs données personnelles. Sont considérées comme des données
              personnelles, toute information permettant d’identifier un utilisateur. A ce titre, il peut s’agir : de
              ses noms et prénoms, de son âge, de son adresse postale ou email, de sa localisation ou encore de son
              adresse IP (liste non-exhaustive) ;
            </li>

            <li>Sur les droits dont ils disposent concernant ces données ;</li>

            <li>
              Sur la personne responsable du traitement des données à caractère personnel collectées et traitées ;
            </li>

            <li>Sur les destinataires de ces données personnelles ;</li>

            <li>Sur la politique du site en matière de cookies.</li>
          </ul>
          <br />
          <p>Cette politique complète les mentions légales et les Conditions Générales d’Utilisation.</p>
        </div>
        <h2 className={styles.articleTitle}>
          2. Principes relatifs à la collecte et au traitement des données personnelles
        </h2>
        <div>
          <p>Conformément à l’article 5 du Règlement européen 2016/679, les données à caractère personnel sont :</p>
          <ul>
            <li>Traitées de manière licite, loyale et transparente au regard de la personne concernée ;</li>
            <li>
              Collectées pour des finalités déterminées, explicites et légitimes, et ne pas être traitées ultérieurement
              d'une manière incompatible avec ces finalités ;
            </li>
            <li>
              Adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles
              sont traitées ;
            </li>
            <li>
              Exactes et, si nécessaire, tenues à jour. Toutes les mesures raisonnables doivent être prises pour que les
              données à caractère personnel qui sont inexactes, eu égard aux finalités pour lesquelles elles sont
              traitées, soient effacées ou rectifiées sans tarder ;
            </li>
            <li>
              Conservées sous une forme permettant l'identification des personnes concernées pendant une durée
              n'excédant pas celle nécessaire au regard des finalités pour lesquelles elles sont traitées ;
            </li>
            <li>
              Traitées de façon à garantir une sécurité appropriée des données collectées, y compris la protection
              contre le traitement non autorisé ou illicite et contre la perte, la destruction ou les dégâts d'origine
              accidentelle, à l'aide de mesures techniques ou organisationnelles appropriées.
            </li>
          </ul>
          <p>
            Le traitement n'est licite que si, et dans la mesure où, au moins une des conditions suivantes est remplie :
          </p>
          <ul>
            <li>
              La personne concernée a consenti au traitement de ses données à caractère personnel pour une ou plusieurs
              finalités spécifiques ;
            </li>
            <li>
              Le traitement est nécessaire à l'exécution d'un contrat auquel la personne concernée est partie ou à
              l'exécution de mesures précontractuelles prises à la demande de celle-ci ;
            </li>
            <li>
              Le traitement est nécessaire au respect d'une obligation légale à laquelle le responsable du traitement
              est soumis ;
            </li>
            <li>
              Le traitement est nécessaire à la sauvegarde des intérêts vitaux de la personne concernée ou d'une autre
              personne physique ;
            </li>
            <li>
              Le traitement est nécessaire à l'exécution d'une mission d'intérêt public ou relevant de l'exercice de
              l'autorité publique dont est investi le responsable du traitement ;
            </li>
            <li>
              Le traitement est nécessaire aux fins des intérêts légitimes poursuivis par le responsable du traitement
              ou par un tiers, à moins que ne prévalent les intérêts ou les libertés et droits fondamentaux de la
              personne concernée qui exigent une protection des données à caractère personnel, notamment lorsque la
              personne concernée est un enfant.
            </li>
          </ul>
        </div>
        <h2 className={styles.articleTitle}>
          3. Données à caractère personnel collectées et traitées dans le cadre de la navigation sur le site
        </h2>
        {/* <p>
          Les données à caractère personnel collectées sur le site sont les suivantes :
          <ul>
            <li>Les données de connexion (adresse IP, logs) ;</li>
            <li>Les données de navigation (type de navigateur, durée de la visite, pages visitées) ;</li>
            <li>Les données de localisation.</li>
          </ul>
          <br />
        </p>

        <p>
          En cas de création d'un compte utilisateur, sont également collectées les données suivantes :
          <ul>
            <li>Nom et prénom ;</li>
            <li>Adresse email ;</li>
            <li>Numéro de téléphone ;</li>
            <li>Adresse postale.</li>
          </ul>
          <br />


          La collecte et le traitement de ces données répond aux finalités suivantes :

          <ul>
            <li>Statistiques et amélioration du site ;</li>
            <li>Envoi de newsletters ;</li>
            <li>Fonctionnement des fonctionnalités internes au site telles que le trombinoscope et le cumul d'emploi du temps ;</li>
          </ul>
        </p> */}
        <h3 className={styles.subArticleTitle}>3.1. Données collectées</h3>
        <p>{/** TODO: Add Data collected */}</p>
        <h3 className={styles.subArticleTitle}>3.2. Mode de collecte des données</h3>
        <p>{/** TODO: Add Data Collection Mode */}</p>
        <h3 className={styles.subArticleTitle}>{/** 3.3. Transmissions des données à un tier */}</h3>
        <p>{/** TODO: Add Matomo and Sentry here */}</p>
        <h3 className={styles.subArticleTitle}>3.3. Informations relatives aux cookies</h3>
        <p>
          Afin d'assurer le fonctionnement du service à l'utilisateur authentifié, des cookies de session sont inscrits
          sur le navigateur :<br />
          - lors de l'authentification sur le site. Ceux-ci ont pour seule fonction d'assurer la persistance de la
          session authentifiée de l'utilisateur. Ils sont détruits à la déconnexion ou à leur expiration,
          <br />- afin de stocker les préférences utilisateurs, comme la langue. Ils sont détruits à leur expiration.
          Ils resteront strictement sur le navigateur, et ne seront jamais envoyés sur nos serveurs, même anonymement.
          Conformément à la directive européenne 2009/136/CE, ces cookies sont indispensables à la fourniture du service
          sollicité.
        </p>
        <h2 className={styles.articleTitle}>
          4. Responsable du traitement des données et délégué à la protection des données
        </h2>
        <h3 className={styles.subArticleTitle}>4.1. Le responsable du traitement des données</h3>
        <div>
          <p>
            Les données à caractère personnelles sont collectées par {env.NEXT_PUBLIC_ASSOCIATION_NAME}, association loi
            1901, dont le numéro RNA est {env.NEXT_PUBLIC_ASSOCIATION_RNA} et le numéro d'immatriculation RCS est{' '}
            {env.NEXT_PUBLIC_ASSOCIATION_RCS}.
          </p>
          <br />
          Le responsable du traitement des données à caractère personnel peut être contacté de la manière suivante :
          <ul>
            <li>Par courrier à l’adresse suivante : {env.NEXT_PUBLIC_ASSOCIATION_ADDRESS}</li>
            <li>Par téléphone au {env.NEXT_PUBLIC_ASSOCIATION_PHONE}</li>
            <li>
              Par mail à l’adresse suivante :{' '}
              <a href={`mailto:${env.NEXT_PUBLIC_ASSOCIATION_EMAIL}`}>{env.NEXT_PUBLIC_ASSOCIATION_EMAIL}</a>
            </li>
          </ul>
        </div>
        <h3 className={styles.subArticleTitle}>4.2. Délégué à la protection des données</h3>
        <div>
          <p>Le délégué à la protection des données de l'association est :</p>
          <ul>
            <li>Nom : {env.NEXT_PUBLIC_DPO_NAME}</li>
            <li>
              Adresse mail : <a href={`mailto:${env.NEXT_PUBLIC_DPO_EMAIL}`}>{env.NEXT_PUBLIC_DPO_EMAIL}</a>
            </li>
          </ul>
          <p>
            Si vous estimez, après nous avoir contactés, que vos droits “Informatique et Libertés”, ne sont pas
            respectés, vous pouvez adresser une information à la CNIL.
          </p>
        </div>
        <h2 className={styles.articleTitle}>
          5. Les droits de l'utilisateur en matière de collecte et de traitement des données
        </h2>
        <div>
          <p>
            Tout utilisateur concerné par le traitement de ses données personnelles peut se prévaloir des droits
            suivants, en application du règlement européen 2016/679 et de la Loi Informatique et Liberté (Loi 78-17 du 6
            janvier 1978) :
          </p>
          <ul>
            <li>
              Droit d’accès, de rectification et droit à l’effacement des données (posés respectivement aux articles 15,
              16 et 17 du RGPD) ;
            </li>

            <li>Droit à la portabilité des données (article 20 du RGPD) ;</li>

            <li>
              Droit à la limitation (article 18 du RGPD) et à l’opposition du traitement des données (article 21 du
              RGPD) ;
            </li>

            <li>Droit de ne pas faire l’objet d’une décision fondée exclusivement sur un procédé automatisé ;</li>

            <li>Droit de déterminer le sort des données après la mort ;</li>

            <li>Droit de saisir l’autorité de contrôle compétente (article 77 du RGPD).</li>
          </ul>
          <p>
            Pour exercer vos droits, veuillez adresser votre courrier à "{env.NEXT_PUBLIC_ASSOCIATION_NAME} -{' '}
            {env.NEXT_PUBLIC_ASSOCIATION_ADDRESS}" ou par mail à{' '}
            <a href={`mailto:${env.ASSOCIATION_EMAIL}`}>{env.NEXT_PUBLIC_ASSOCIATION_EMAIL}</a>.
            <br />
            Afin que le responsable du traitement des données puisse faire droit à sa demande, l’utilisateur peut être
            tenu de lui communiquer certaines informations telles que : ses noms et prénoms, son adresse e-mail ainsi
            que son numéro étudiant s'il en dispose d'un.
            <br />
            Consultez le site <a href="https://cnil.fr">cnil.fr</a> pour plus d’informations sur vos droits.
          </p>
        </div>
        <h2 className={styles.articleTitle}>6. Conditions de modification de la politique de confidentialité</h2>
        <p>
          L’éditeur du site EtuUTT se réserve le droit de pouvoir modifier la présente Politique à tout moment afin
          d’assurer aux utilisateurs du site sa conformité avec le droit en vigueur.
          <br />
          Les éventuelles modifications ne sauraient avoir d’incidence sur les achats antérieurement effectués sur le
          site, lesquels restent soumis à la Politique en vigueur au moment de l’achat et telle qu’acceptée par
          l’utilisateur lors de la validation de l’achat.
          <br />
          L’utilisateur est invité à prendre connaissance de cette Politique à chaque fois qu’il utilise nos services,
          sans qu’il soit nécessaire de l’en prévenir formellement.
          <br />
          La présente politique, éditée le 02/04/2024, a été mise à jour le {env.NEXT_PUBLIC_LAST_PRIVACY_POLICY_UPDATE}
          .
        </p>
      </div>
    </Page>
  );
}
