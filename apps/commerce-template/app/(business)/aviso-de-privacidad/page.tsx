import type { Metadata } from "next";
import { Container, LoadingProgress, Typography } from "ui";
import { getSellerInfo } from "core";
import { Suspense } from "react";
import { commerceConfig } from "../../config";

// Content

export const metadata: Metadata = {
  title: `Aviso de Privacidad | ${commerceConfig.sellerName}`,
};

export default async function Page(): Promise<JSX.Element> {
  const sellerInfo = await getSellerInfo(
    commerceConfig.apiUrl,
    commerceConfig.sellerId
  );
  const privacyA = [
    {
      text: `En cumplimiento a la normatividad en materia de comercio y Protección de datos Personales en posesión de los Particulares, ${commerceConfig.sellerName} (de ahora en adelante y para efectos del presente “${commerceConfig.sellerName}”), pone a disposición del público el siguiente documento, el cual expone los Términos y Condiciones de uso dentro de el dominio donde se encuentra publicado éste aviso de privacidad , sujetando a los usuarios de forma expresa y sin reserva.`,
    },
    {
      title: `I. CONTACTO.`,
      text: `En caso de tener dudas o comentarios respecto a cualquier información relativa a los servicios encontrados en la plataforma, le pedimos contacte al personal correspondiente por medio de correo ${sellerInfo.commerceCTACopies.footer.supportContact.email} para realizar cualquier comunicación relativa al servicio.`,
    },
    {
      title: `II.- ¿QUE DATOS PERSONALES RECOLECTAMOS Y PARA QUE FINALIDADES LOS TRATAMOS?`,
      text: `“${commerceConfig.sellerName}” recopila distintos datos suyos, los cuales describimos a continuación de una manera clara: (1) Nombre completo (2) Dirección (3) Número telefónico (4) Correo electrónico. (5) Al menos un método de Pago vigente;
              *”${commerceConfig.sellerName}” no resguarda en ningún momento información sensible como datos bancarios o los relativos a tarjetas de débito o crédito, así como la dirección vinculada a las mismas y cualquier dato relacionado con el método de pago proporcionado por el Usuario ya que todo lo relativo a los pagos y la información solicitada para la realización de los mismos es proporcionada a través de la plataforma de pago “Stripe” la cual está integrada a “${commerceConfig.sellerName} ”, por lo cual es responsabilidad del Usuario el revisar los Términos y Condiciones así como el Aviso de Privacidad perteneciente a dicha plataforma de pago y que se encuentran la página web relativa a la misma.
              **Todos y cada uno de los datos relativos a la tarjeta de crédito/débito mediante la cual pagará los productos y servicios derivados del uso de la “APLICACIÓN Y/O PÁGINA DE INTERNET DE ${commerceConfig.sellerName}” NO son almacenados en manera alguna por “${commerceConfig.sellerName}”, los mismos son procesados a través de la plataforma de pago “Stripe” la cual es el medio por el cual los Usuarios compran los servicios y productos comercializados por terceros a través de la misma y que resguardará los datos de pago proporcionados por el Usuario para realizar transacciones a través de la “APLICACIÓN Y/O PÁGINA DE INTERNET DE ${commerceConfig.sellerName}”, utilizando los medios o la tecnología más avanzada de tokenización de datos sensibles. El Usuario es el único responsable de toda la actividad que ocurre en su cuenta y se compromete a mantener en todo momento de forma segura y secreta todos y cada uno de los datos relativos a la misma.
              Cuando usted utiliza la “APLICACIÓN Y/O PÁGINA DE INTERNET DE ${commerceConfig.sellerName}” podrá utilizar información no personal relacionada con su experiencia en dicha página, la cual utilizamos únicamente con la finalidad de mejorar los contenidos de la misma.
              Cuando usted utiliza los servicios de la “APLICACIÓN Y/O PÁGINA DE INTERNET DE ${commerceConfig.sellerName}” únicamente recopilamos sus datos personales con los siguientes fines (1) Para fines de identificación; (2) Para fines estadísticos;(3) Para eventualmente contactarlo vía correo electrónico o teléfono con el fin de compartirle noticias de interés (actualizaciones en el sistema, cambios en “Términos y Condiciones” y “Aviso de Privacidad”, promociones, etc.); (4) Para efectuar los pagos que se deriven en su caso, por el uso de la plataforma; (5) Para informarle acerca de los datos sensibles y su uso y (6) Para proporcionar al Usuario información importante sobre el envío de los productos adquiridos por el mismo a través de la plataforma.
              Sus datos personales únicamente serán divulgados y/o compartidos con terceros en el caso en que los negocios operados por “${commerceConfig.sellerName}” sean vendidos a un tercero y siempre que éste tercero acepte respetar el presentes aviso de privacidad.`,
    },
    {
      title: `III.- CONSENTIMIENTO`,
      text: `Al proporcionarnos sus datos personales expresamente reconoce y consciente el siguiente Aviso de Privacidad, otorgándonos la facultad para que procedamos al tratamiento de sus datos personales de la forma en que se señala en el presente Aviso de Privacidad y en apego a la legislación aplicable.`,
    },
    {
      title: `IV.- ADMINISTRACIÓN TÉCNICA Y FUNCIONAL DE NUESTRA APLICACIÓN`,
      text: `Cuando usted utiliza la “APLICACIÓN Y/O PÁGINA DE INTERNET DE ${commerceConfig.sellerName}” el administrador de la misma trata los siguientes datos técnicos: dirección de IP, así como la duración de la visita/sesión, lo que nos permite ejecutar las funcionalidades de nuestro sitio web y/o aplicación. De esta manera, nos aseguramos de que usted pueda seguir contando con la mejor información y utilidad de la aplicación. Para lo anterior podemos hacer uso de cookies, por favor revise el apartado de “Uso de Cookies” que se incluye en el presente documento.`,
    },
    {
      title: `V.- GENERACIÓN DE INFORMACIÓN ADMINISTRATIVA Y DATOS ESTADÍSTICOS`,
      text: `“${commerceConfig.sellerName}” utiliza información de manera anónima y desagregada para monitorear cuales son las funciones más utilizadas, analizar patrones de los usuarios y determinar áreas de oportunidad del servicio. Para el análisis y estadística de la información podremos compartirla con terceros que nos presenten servicios relacionados con dicho estudio y nunca se compartirá información sensible de los usuarios en dichas estadísticas.`,
    },
    {
      title: `VI.- ¿CÓMO COMPARTIMOS SUS DATOS?`,
      text: `“${commerceConfig.sellerName}” podrá contratar encargados, personas físicas o morales, para prestar parte del servicio por cuenta nuestra, procesar pagos, proporcionar servicios de atención al cliente, proporcionar información de geolocalización, llevar a cabo servicios relacionados con la aplicación  (incluyendo, servicios de mantenimiento, administración de bases de datos, análisis y mejoras de las funciones de la aplicación), para prestar servicios de publicidad, mercadotecnia y prospección comercial, así como para asistirnos en el análisis del funcionamiento de nuestro servicio. Estos terceros tendrán acceso a sus datos personales exclusivamente para llevar a cabo, por nuestra cuenta, las finalidades que nosotros le encomendamos y se encuentran contractualmente obligados a no utilizarla para otros fines o a divulgarla.
                “${commerceConfig.sellerName}” revelará sus datos solamente dentro de los márgenes legales permitidos y necesarios, y en la medida que sea necesario para la procuración o administración de la justicia o reconocimiento, ejercicio o defensa de un derecho en un proceso judicial, o en caso, una emergencia respecto a su salud y/o seguridad. También transferiremos su información a nuestras sociedades controladoras, subsidiarias o afiliadas u otras sociedades de nuestro mismo grupo, las cuales operan bajo los mismos procesos y políticas internas.
                “${commerceConfig.sellerName}” no transfiere sus datos personales de forma adicional alguna, nos comprometemos a no vender, intercambiar, transferir, publicar o difundir a terceros ajenos a “${commerceConfig.sellerName}” excepto en el supuesto en el que los negocios sean adquiridos por un nuevo operador de negocios y que éste se comprometa a salvaguardar los derechos previstos en el presente documento. En adición a lo anterior, la única forma en que nos veríamos obligados a revelar sus datos es mediante la orden de una autoridad competente.
                Como usuario tiene derecho a acceder y estar informado sobre la información contenida en su cuenta de usuario, incluyendo aquella información que usted nos ha proporcionado, y a la información respecto a cada uno de los pedidos y compras realizados a través de la aplicación. 
                Sus datos personales pueden ser transferidos y tratados dentro y fuera del país, por personas distintas a esta empresa. En ese sentido, su información puede ser compartida con farmacias, laboratorios y tiendas de autoservicios afiliadas a nuestro sitio web para los fines de comunicar a nuestros afiliados el perfil de nuestros usuarios e informar a dichos usuarios posibles promociones y/o acuerdos comerciales.
                Nos comprometemos a no transferir su información personal a terceros sin su consentimiento, salvo las excepciones previstas en el artículo 37 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, así como a realizar esta transferencia en los términos que fija esa ley.
                Salvo en los casos del artículo 37 de la Ley, “Artículo 37.- Las transferencias nacionales o internacionales de datos podrán llevarse a cabo sin el consentimiento del titular cuando se dé alguno de los siguientes supuestos: 
                Cuando la transferencia esté prevista en una Ley o Tratado en los que México sea parte; 
                Cuando la transferencia sea necesaria para la prevención o el diagnóstico médico, la prestación de asistencia sanitaria, tratamiento médico o la gestión de servicios sanitarios; 
                Cuando la transferencia sea efectuada a sociedades controladoras, subsidiarias o afiliadas bajo el control común del responsable, o a una sociedad matriz o a cualquier sociedad del mismo  grupo del responsable que opere bajo los mismos procesos y políticas internas; 
                Cuando la transferencia sea necesaria por virtud de un contrato celebrado o por celebrar en interés del titular, por el responsable y un tercero; 
                Cuando la transferencia sea necesaria o legalmente exigida para la salvaguarda de un interés público, o para la procuración o administración de justicia; 
                Cuando la transferencia sea precisa para el reconocimiento, ejercicio o defensa de un derecho en un proceso judicial, y 
                Cuando la transferencia sea precisa para el mantenimiento o cumplimiento de una relación jurídica entre el responsable y el titular.”
                Si usted no manifiesta su oposición para que sus datos personales sean transferidos, se entenderá que ha otorgado su consentimiento para ello. Nos reservamos el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso de privacidad, para la atención de novedades legislativas, políticas internas o nuevos requerimientos para la prestación u ofrecimiento de nuestros servicios o productos. Estas modificaciones estarán disponibles al público a través de nuestra página de internet en la sección de aviso de privacidad.`,
    },
    {
      title: `VII.- DERECHOS ARCO`,
      text: `Usted, como titular y usuario, tiene derecho a: 
            Acceder a sus datos personales y conocer los detalles del tratamiento de los mismos;
            Rectificarlos en caso de estar desactualizados, ser inexactos o estar incompletos; 
            Cancelarlos cuando considere que no están siendo utilizados conforme a los principios, deberes y obligaciones aplicable; u
            Oponerse al tratamiento de sus datos personales para fines específicos.
            Esto derechos se conocen como los Derechos ARCO.`,
    },
    {
      title: `VIII.- EJERCICIO DE DERECHOS ARCO`,
      text: `Usted puede ejercitar los sus derechos ARCO por escrito o por correo electrónico, en caso de hacerlo por escrito, la solicitud deberá ser entregada en nuestro domicilio con atención al área encargada de la protección de datos personales, acompañada de la siguiente información y documentación:
              Datos de identificación del Usuario y/o su representante legal. En el caso del representante legal se deberá acompañar del documento con el que se acredite su personalidad.
              La descripción de manera clara y precisa de los datos personales respecto de los cuales busca ejercer sus Derechos ARCO, así como el derecho o derechos que desea ejercer. Su solicitud deberá ser firmada al final del escrito y rubricada al calce de cada una de las hojas.
              Domicilio para oír y recibir la contestación de “${commerceConfig.sellerName}” y, en su caso, futuras comunicaciones y/o notificaciones, o bien su deseo de que nuestra contestación y/o futuras notificaciones o contestaciones sean enviadas a través de correo electrónico, indicando la respectiva cuenta.
              Copia de la identificación oficial vigente del Usuario y/o su representante legal.
              Si decide hacerlo por correo electrónico, por favor enviar su solución al área de protección de datos personales, en el correo electrónico ${sellerInfo.commerceCTACopies.footer.supportContact.email}, acompañada de la siguiente información y documentación:
              Datos de identificación del Usuario y/o su representante legal. En el caso del representante legal se deberá acompañar del documento con el que se acredite su personalidad. Los documentos podrán ser escaneados y adjuntados al correo electrónico para verificar su veracidad.
              La descripción de manera clara y precisa de los datos personales respecto de los cuales se busca ejercer Derechos ARCO, así como el derecho o derechos que se desea ejercer, lo cual podrá hacerse en el texto del correo electrónico o en un documento adjunto escaneado y debidamente firmado al final del mismo y rubricado al calce de cada una de las hojas.
              Señalar expresamente el deseo de recibir la contestación de “${commerceConfig.sellerName}” a su petición a través de correo electrónico, indicando la dirección de correo electrónico que corresponda.
              Copia de identificación oficial vigente del Usuario y/o de su representante legal. Los documentos podrán ser escaneados y adjuntados al correo electrónico para verificar su veracidad.
              Una vez que la solicitud para ejercer Derechos ARCO se encuentre a disposición del área encargada de “${commerceConfig.sellerName}”, independientemente de la forma en que se reciba, se emitirá la respectiva contestación en un plazo no mayor a 20 días a partir de su recepción. La cual haremos del conocimiento del cliente a través del medio de contacto elegido. Una vez recibida la contestación de “${commerceConfig.sellerName}” tendrá un plazo de 20 días hábiles para emitir su contestación. En caso de no responder a la contestación de “${commerceConfig.sellerName}” en el plazo señalado, se entenderá de buena fe que está conforme con la respuesta.
              Si su solicitud de ejercicio de Derechos ARCO es acerca del ejercicio del derecho de acceso, “${commerceConfig.sellerName}” pondrá a su disposición la información o datos personales a través de copias simples y/o documentos electrónicos.
              “${commerceConfig.sellerName}”, como responsable, podrá negar el ejercicio de Derechos ARCO por parte de los usuarios, en los supuestos que lo permita la Ley, por lo que deberá informar a los clientes el motivo de tal decisión. La negativa podrá ser parcial, en cuyo caso “${commerceConfig.sellerName}” efectuará el acceso, rectificación, cancelación u oposición en la parte procedente.`,
    },
    {
      title: `VIX. - REVOCACIÓN DEL CONSENTIMIENTO AL TRATAMIENTO DE SUS DATOS PERSONALES`,
      text: `Usted, como titular de sus datos personales, puede revocar su consentimiento para el tratamiento de los mismos conforme al procedimiento previsto en la sección anterior “Ejercicio de Derechos ARCO”.
              Usted entiende que si revoca su consentimiento para el tratamiento de sus datos cancelaremos su cuenta y procederemos a suprimirlos en términos de este aviso de privacidad.`,
    },
    {
      title: `X.- CONSERVACIÓN`,
      text: `Salvo por lo dispuesto en este Aviso de Privacidad, conservaremos sus datos personales hasta en tanto no cancele su cuenta. Si usted desea cancelar su cuenta y que ya no utilicemos su información para prestarle servicios, por favor contáctenos en el correo electrónico ${sellerInfo.commerceCTACopies.footer.supportContact.email} una vez que solicite la eliminación de su cuenta, se procederá a desasociar sus datos y que estos sean anónimos, salvo que sea necesario conservar los mismos para cumplir con la legislación aplicable o resolver reclamaciones.`,
    },
    {
      title: `XI.- SEGURIDAD`,
      text: `No obstante que “${commerceConfig.sellerName}” utiliza la tecnología más avanzada para salvaguardar los datos que nos envía, existe la probabilidad de que pueda haber un defecto en la programación de las aplicaciones que utilizamos que permita el acceso forzado a la información. Aún y cuando esta situación se llegará a dar, sus datos están protegidos mediante procesos de cifrado avanzado que hacen imposible la recuperación útil de la información por un tercero ajeno a “${commerceConfig.sellerName}”.`,
    },
    {
      title: `XII.- PROPIEDAD INTELECTUAL`,
      text: `Los derechos de propiedad intelectual respecto de la aplicación, Servicios y Contenidos y los signos distintivos y dominios de la misma, así como los derechos de uso y explotación de los mismos, incluyendo su divulgación, publicación, reproducción, distribución y transformación, son propiedad exclusiva de “${commerceConfig.sellerName}”. El usuario no adquiere ningún derecho de propiedad intelectual por el simple uso de los contenidos de la aplicación, los Servicios y Contenidos y en ningún momento dicho uso será considerado como una autorización ni licencia para utilizar los Servicios y Contenidos con fines distintos a los que se contemplan en los presentes Términos y Condiciones de Uso y Privacidad.`,
    },
    {
      title: `XIII.- PROPIEDAD INTELECTUAL DE TERCEROS`,
      text: `El usuario acuerda que las disposiciones que se establecen en el inciso II anterior respecto de la titularidad de los derechos de “${commerceConfig.sellerName}” también son aplicables a los derechos de terceros respecto de los Servicios y Contenidos de las páginas enlazadas al portal y la aplicación.`,
    },
    {
      title: `XIV.- USOS Y RESTRICCIONES PERMITIDOS`,
      text: `El aprovechamiento de los Servicios y Contenidos de la aplicación es exclusiva responsabilidad del usuario, quien en todo caso deberá servirse de ellos acorde a las funcionalidades permitidas por la aplicación y a los usos autorizados en el presente Aviso de Privacidad, por lo que el usuario se obliga a utilizarlos de modo tal que no atenten contra las normas de uso y convivencia en Internet, las leyes de los Estados Unidos Mexicanos, las buenas costumbres, la dignidad de la persona y los derechos de terceros. La aplicación es para uso personal y del usuario por lo que no podrá comercializar de manera alguna los Servicios y Contenidos.`,
    },
    {
      title: `XV.- BIENES Y SERVICIOS DE TERCEROS ENLAZADOS`,
      text: `Respecto de los Servicios y Contenidos que prestan terceros dentro o mediante enlaces a la Aplicación (tales como ligas, banners y botones), “${commerceConfig.sellerName}” se limita exclusivamente, para conveniencia del usuario: 
              A informar al usuario sobre los mismos.
              No existe ningún tipo de relación laboral, asociación o sociedad, entre “${commerceConfig.sellerName}” y dichos terceros. Toda asesoría, consejo, declaración, información y contenido de las páginas de terceros enlazadas o dentro del Portal representan las opiniones y juicios de dicho tercero, consecuentemente, “${commerceConfig.sellerName}” no será responsable de ningún daño o perjuicio que sufra el usuario a consecuencia de los mismos, incluyendo, de manera enunciativa mas no limitativa, daños causados por la pérdida de datos o programas.`,
    },
    {
      title: `XVI.- CONFIDENCIALIDAD`,
      text: `“${commerceConfig.sellerName}” se obliga a mantener confidencialidad la información que reciba del usuario que tenga dicho carácter conforme a las disposiciones legales aplicables, en los Estados Unidos Mexicanos. “${commerceConfig.sellerName}” no asume ninguna obligación de mantener confidencial cualquier otra información que el usuario le proporcione, ya sea al inscribirse al a la Aplicación, o en cualquier otro momento posterior, incluyendo aquella información que el usuario proporcione a través de boletines, pizarras o plática en línea (chats), así como la información que obtenga “${commerceConfig.sellerName}” a través de las cookies que se describen en el inciso referente a cookies.`,
    },
    {
      title: `XVII.- PROGRAMA DE PRIVACIDAD DE ${commerceConfig.sellerName}`,
      text: `La seguridad de su información personal es nuestra prioridad. Nosotros protegemos esta información mediante el mantenimiento de protecciones físicas, electrónicas y de procedimiento que cumplen o exceden lo previsto en la legislación aplicable. Nosotros capacitamos a nuestros empleados en el manejo adecuado de la información personal. Al utilizar otras compañías para que nos presten servicios, les exigimos proteger la confidencialidad de la información personal que ellos reciban.`,
    },
    {
      title: `XVIII.- USO DE LA INFORMACIÓN NO CONFIDENCIAL`,
      text: `Mediante el uso del Portal y/o la Aplicación, el usuario autoriza a “${commerceConfig.sellerName}” a utilizar, publicar, reproducir, divulgar, comunicar públicamente y transmitir la información no confidencial, en términos de lo establecido en el artículo 109 de la Ley Federal de los Derechos de Autor y de la fracción I, del artículo 76 bis de la Ley Federal de Protección al Consumidor.`,
    },
    {
      title: `XIX.- COOKIES `,
      text: `El usuario que tenga acceso al Portal y/o a la aplicación, acuerda recibir las cookies que les transmitan los servidores de “${commerceConfig.sellerName}” 'Cookie' significa un archivo de datos que se almacena en el disco duro de la computadora del usuario cuando éste tiene acceso al Portal y/o a la aplicación. Las Cookies pueden contener información tal como la identificación proporcionada por el usuario o información para rastrear las páginas que el usuario ha visitado. Una Cookie no puede leer los datos o información del disco duro del usuario ni leer las Cookies creadas por otros sitios o páginas
              Las cookies son archivos de texto que son descargados automáticamente y almacenados en el disco duro del equipo de cómputo del usuario al navegar en una página de Internet específica, que permiten recordar al servidor de Internet algunos datos sobre este usuario, entre ellos, sus preferencias para la visualización de las páginas en ese servidor, nombre y contraseña. Le informamos que utilizamos cookies para obtener información personal de usted, como la siguiente:
              Su tipo de navegador y sistema operativo. Las páginas de Internet que visita.Los vínculos que sigue.La dirección IP.
              El sitio que visitó antes de entrar al nuestro.
              Estas cookies y otras tecnologías pueden ser deshabilitadas.`,
    },
    {
      title: `XX.- CLAVES DE ACCESO CONFIDENCIALES`,
      text: `En todo momento, el usuario es el responsable único y final de mantener en secreto la identificación de su usuario, contraseñas personales, claves de acceso y otros datos confidenciales con los cuales tenga acceso a los Servicios y Contenidos de la aplicación, así como a las páginas de terceros. El usuario deberá de generar además de una contraseña para el uso de la aplicación un número PIN, mismo que utilizará al momento de finalizar sus pedidos y que proporcionará al repartidor correspondiente.`,
    },
    {
      title: `XXII.- ACUERDOS GENERALES`,
      text: `“${commerceConfig.sellerName}” no garantiza la disponibilidad y continuidad de la operación de la aplicación y de los Servicios y Contenidos, ni la utilidad de la aplicación o los Servicios y Contenidos en relación con ninguna actividad específica. “${commerceConfig.sellerName}” no será responsable por ningún daño o pérdida de cualquier naturaleza que pueda ser causado debido a la falta de disponibilidad o continuidad de operación de la aplicación y/o de los Servicios y Contenidos.
            “${commerceConfig.sellerName}” podrá en cualquier momento descontinuar o modificar, temporal o permanentemente, los servicios con o sin previo aviso a los usuarios.
            “${commerceConfig.sellerName}” no es dueño ni responsable de los logos, nombres comerciales, marcas, slogans y/o páginas web de terceros que se utilicen o enlacen con Google.`,
    },
    {
      title: `XXIII.- LEYES APLICABLES Y JURISDICCIÓN`,
      text: `Para la interpretación, cumplimiento y ejecución del presente Contrato, las partes están de acuerdo en que serán aplicables las leyes Federales de los Estados Unidos Mexicanos y competentes los tribunales de la Ciudad de México, renunciando expresamente a cualquier otro fuero o jurisdicción que pudiera corresponderles en razón de sus domicilios presentes o futuros.`,
    },
  ];

  return (
    <Suspense
      fallback={<LoadingProgress sx={{ my: 30, backgroundColor: "inherit" }} />}
      key=""
    >
      <Container sx={{ textAlign: "left", width: "85%", mt: 5, mb: 10 }}>
        <div>
          <Typography sx={{ mb: 5, typography: "h2" }} variant="h1">
            Aviso de Privacidad
          </Typography>
        </div>

        {privacyA.map((prg, j) => {
          return (
            // eslint-disable-next-line react/no-array-index-key -- safe
            <div key={j} style={{ marginTop: 5 }}>
              {prg.title ? (
                <Typography sx={{ mb: 1 }} variant="h5">
                  {prg.title}
                </Typography>
              ) : null}

              {prg.text ? (
                <Typography color="textSecondary" sx={{ mb: 2 }}>
                  {prg.text}
                </Typography>
              ) : null}
            </div>
          );
        })}
      </Container>
    </Suspense>
  );
}
