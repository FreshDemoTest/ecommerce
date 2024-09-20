import type { Metadata } from "next";
import { Container, Typography } from "ui";
import { getSellerInfo } from "core";
import { commerceConfig } from "../../config";

// Content

export const metadata: Metadata = {
  title: `Términos y Condiciones | ${commerceConfig.sellerName}`,
};

export default async function Page(): Promise<JSX.Element> {
  const sellerInfo = await getSellerInfo(
    commerceConfig.apiUrl,
    commerceConfig.sellerId
  );
  const TyC = [
    {
      text: `Bienvenido a ${sellerInfo.commerceConfig.sellerName}, y a nuestros Términos de Uso (estos "Términos"). Estos Términos son un contrato legal entre usted y ${sellerInfo.commerceConfig.sellerName} ("${sellerInfo.commerceConfig.sellerName}", "nosotros", "nos" o "nuestro") y rigen su uso de todos los textos, datos, información, software, gráficos, fotografías y otros materiales que ponemos a su disposición, así como los servicios que podemos proporcionar a través de nuestros sitios web (cada uno un "Sitio").`,
    },
    {
      text: `${sellerInfo.commerceConfig.sellerName} puede modificar, suspender o interrumpir cualquier parte o la totalidad de nuestros Sitios o nuestros servicios en cualquier momento y sin notificarle. También nos reservamos el derecho de cambiar o modificar estos Términos en cualquier momento y a nuestra única discreción. Si realizamos cambios en estas Condiciones, se lo notificaremos, por ejemplo, actualizando la fecha de "Última actualización" al final de estas Condiciones y, si está suscrito a nuestro servicio, notificándole dichos cambios por correo electrónico y requiriéndole que acepte las nuevas Condiciones en su próximo inicio de sesión en el servicio. Al seguir accediendo o utilizando los Sitios o al pedir, recibir o utilizar productos, usted confirma su aceptación de las Condiciones revisadas y de todos los términos incorporados en ellas por referencia. Le recomendamos que revise las Condiciones con frecuencia para asegurarse de que entiende los términos y condiciones que se aplican cuando accede o utiliza los Sitios o pide, recibe o utiliza los productos. Si no está de acuerdo con las Condiciones revisadas, no podrá acceder o utilizar los Sitios ni pedir, recibir o utilizar los productos.`,
    },
    {
      text: `En estos Términos le concedemos una licencia limitada, personal, no exclusiva e intransferible para utilizar y mostrar los Sitios y utilizar los servicios disponibles a través del Sitio; su derecho a utilizar dichos Sitios y servicios está condicionado al cumplimiento de estos Términos.  Usted no tiene ningún otro derecho sobre los Sitios, servicios, y/o cualquiera de los materiales mostrados o puestos a disposición a través de los Sitios y servicios, y no puede modificar, editar, copiar, reproducir, crear trabajos derivados, realizar ingeniería inversa, alterar, mejorar, o de cualquier manera explotar cualquiera de estos Sitios o partes de los mismos de ninguna manera.`,
    },
    {
      title: "I. USANDO LOS SITIOS.",
      text: `Al utilizar cualquier Sitio, usted declara que es mayor de edad en su estado o provincia de residencia, o si es menor de edad en su estado o provincia de residencia (un "Menor"), que está utilizando el Sitio con el consentimiento de su padre o tutor legal y que ha recibido el permiso de su padre o tutor legal para utilizar el Sitio y aceptar estos Términos.  Si usted es el padre o el tutor legal de un menor, se compromete a obligar al menor a cumplir estas condiciones y a indemnizarnos y eximirnos de toda responsabilidad si el menor incumple cualquiera de estas condiciones.
    Para acceder a ciertas áreas restringidas por contraseña de los Sitios y para comprar nuestros productos, debe registrar correctamente una cuenta con nosotros.  Mientras utilice la cuenta, se compromete a proporcionar información verdadera, precisa, actual y completa, lo que puede conseguirse entrando en su cuenta y realizando directamente los cambios pertinentes.  Dado que se trata de su cuenta, es su responsabilidad obtener y mantener todos los equipos y servicios necesarios para el acceso y uso de los Sitios, así como pagar los cargos relacionados. También es su responsabilidad mantener la confidencialidad de la contraseña de su cuenta.  Si cree que su contraseña o la seguridad de su cuenta ha sido violada de alguna manera, debe notificárnoslo inmediatamente.
    Al crear una cuenta de ${sellerInfo.commerceConfig.sellerName}, también da su consentimiento para recibir comunicaciones electrónicas de ${sellerInfo.commerceConfig.sellerName} (por ejemplo, a través del correo electrónico). Estas comunicaciones pueden incluir avisos sobre su cuenta (por ejemplo, un correo electrónico para personalizar su caja cada semana) y forman parte de su relación con nosotros. También podemos enviarle comunicaciones promocionales por correo electrónico, incluyendo, entre otras cosas, boletines de noticias, ofertas especiales, encuestas y otras noticias e información que consideremos de interés para usted. Puede optar por no recibir estos correos electrónicos promocionales en cualquier momento siguiendo las instrucciones para darse de baja que se proporcionan en ellos.
    Al proporcionarnos su número de teléfono móvil a través de la página web o en relación con su pedido, recepción o uso de nuestro servicio, usted da su consentimiento para recibir llamadas o mensajes de texto en cualquiera de dichos números de teléfono realizados por ${sellerInfo.commerceConfig.sellerName} o en su nombre, incluyendo llamadas y/o mensajes de texto de marcación automática, con fines operativos o transaccionales, tales como actualizaciones sobre el estado de entrega de su pedido, cuestiones de facturación o recordatorios de personalización. Puede optar por no recibir llamadas poniéndose en contacto con nuestro equipo de atención al cliente. Para ello, envíe un formulario llenado en nuestra página de Contacto y un asociado de Atención al Cliente responderá a su consulta. Tras dicha exclusión, es posible que siga recibiendo llamadas o mensajes durante un breve periodo de tiempo mientras ${sellerInfo.commerceConfig.sellerName} procesa su solicitud. Tenga en cuenta que ${sellerInfo.commerceConfig.sellerName} puede enviarle un mensaje adicional para confirmar su exclusión.  Es su responsabilidad mantener actualizada la información de su cuenta, incluyendo su número de teléfono. Es posible que se apliquen las tarifas estándar de mensajes y datos que aplica tu operador de telefonía móvil. Para más información sobre las tarifas de datos, póngase en contacto con su operador de telefonía móvil.`,
    },
    {
      title: "II. INFORMACIÓN SOBRE EL PAGO Y LA FACTURACIÓN",
      text: `Usted se compromete a pagar el precio aplicable a todos los productos que pida y se compromete a pagar todas las tasas aplicables, incluyendo pero no limitándose a los impuestos relacionados con su uso de nuestros Sitios y servicios.  Podemos suspender o cancelar su cuenta y/o el acceso a nuestros servicios si su pago se retrasa y/o su tarjeta de crédito no puede ser procesada. Al facilitar una tarjeta de crédito o débito, usted declara y garantiza que está autorizado a utilizar el método de pago designado y que nos autoriza (o a nuestro procesador de pagos externo) a cargar en su método de pago el importe total de su compra (incluidos los impuestos aplicables y otros cargos) (colectivamente, según corresponda, un "Pedido"). Si el método de pago no puede verificarse, no es válido o no es aceptable por otros motivos, su Pedido puede ser suspendido o cancelado.`,
    },
    {
      title: "III. Precios y Disponibilidad",
      text: `Al confirmar un pedido, te comprometes a pagar el importe total de la orden.   Nos reservamos el derecho, en cualquier momento, de modificar, suspender o interrumpir la venta de cualquier producto con o sin previo aviso.  Puede ver el importe total del pedido entrando en el panel de control de su cuenta (apartado de Historial).  El importe total cobrado por su pedido incluye el precio de los, más las tarifas de precio base de los empaques, los gastos de envío, otras tarifas y los impuestos aplicables.
    Aunque nos esforzamos por mantener la exactitud de la información mantenida en nuestros Sitios, incluyendo la información de precios y los detalles de los productos, ocasionalmente pueden producirse errores en los precios u otra información.  En el caso de que algún producto aparezca con un precio incorrecto o con otra información incorrecta, nos reservamos el derecho de rechazar o cancelar cualquier pedido, tanto si se ha confirmado como si no se ha cargado en su tarjeta de crédito.`,
    },
    {
      title: "IV. Entregas",
      text: `Usted es responsable de inspeccionar todos los productos que reciba de nosotros para detectar cualquier daño u otros problemas en el momento de la entrega. Debe almacenar adecuadamente (incluyendo la refrigeración cuando sea aplicable) todos los artículos que reciba.  Si no está en la dirección de entrega cuando llega una repartidor, el repartidor lo contactará y esperará hasta 15 minutos a partir de la hora de llegada antes de proceder a partir.  Se presume que cualquier persona que reciba la entrega en la dirección de entrega está autorizada a recibirla. En los casos en los que usted haya designado un receptor alternativo, dicha persona aceptará los productos en los mismos términos y condiciones que se aplicarían si usted mismo hubiera aceptado la entrega. Si no recibe su entrega, si le faltan artículos o si no está completamente satisfecho con su pedido, póngase en contacto con nuestro equipo de Atención al Cliente. No nos hacemos responsables de (i) artículos entregados en direcciones incorrectas suministradas durante el pedido; (ii) problemas de entrega y de calidad derivados de que el destinatario no esté presente en el momento de la entrega en la dirección suministrada durante el pedido; (iii) disminución de la calidad del producto debido a una dirección de entrega incorrecta suministrada durante el pedido, o a un cambio de ruta solicitado por el destinatario; (iv) problemas de calidad del producto causados por una manipulación inadecuada por parte del destinatario. En algunos casos, como consecuencia de las inclemencias del tiempo, de un desastre natural o nacional, o de otras circunstancias imprevistas, su entrega no podrá realizarse en el día de entrega asignado.  En esos casos, haremos todo lo posible para entregar su pedido lo más cerca posible del día de entrega asignado.  En el caso de que no podamos entregar su caja, se lo notificaremos y abonaremos en su cuenta la entrega perdida si es necesario.
    De vez en cuando, ${sellerInfo.commerceConfig.sellerName} puede ofrecer lugares para recoger en tienda o almacén. Para los clientes que se les asigna un sitio de recolección:  Cualquier pedido que no se recoja durante la ventana de tiempo del sitio de recogida se perderá por el cliente y se convertirá en la propiedad de ${sellerInfo.commerceConfig.sellerName}. `,
    },
    {
      title: "V. Descripciones de Producto",
      text: `${sellerInfo.commerceConfig.sellerName} intenta ser lo más preciso posible con todas las descripciones de nuestros productos.  Sin embargo, ${sellerInfo.commerceConfig.sellerName} no garantiza que las descripciones de los productos, las fotos u otros contenidos de cualquier producto sean precisos, completos, fiables, actuales o libres de errores. Los productos entregados pueden variar de las imágenes y descripciones que se ven en el sitio debido a una serie de factores que no están bajo nuestro control, incluyendo, sin limitación, las capacidades del sistema y las limitaciones de su ordenador, y la disponibilidad y la variabilidad del producto, el embalaje y las materias primas. Aunque haremos esfuerzos comercialmente razonables para ayudar a que los productos se ajusten a las expectativas razonables, a veces pueden producirse variaciones. Trabajamos específicamente con productos que pueden ser deformes y, a veces, de color erróneo. Por esta razón, los pesos mostrados son aproximados y pretenden comunicar las cantidades aproximadas de producto que recibirá.`,
    },
    {
      title: "VI - DEVOLUCIONES, SUSTITUCIONES, CRÉDITOS Y REEMBOLSOS",
      text: `Revisar la respectivas políticas de venta y entrega de ${sellerInfo.commerceConfig.sellerName}, en la sección de Nosotros. ${sellerInfo.commerceConfig.sellerName} se reserva el derecho de rechazar el servicio, rechazar la distribución de créditos o reembolsos, cancelar cuentas, cancelar sus derechos de uso de ${sellerInfo.commerceConfig.sellerName} o cancelar pedidos a su entera discreción.`,
    },
  ];
  return (
    <Container sx={{ textAlign: "left", width: "85%", mt: 5, mb: 10 }}>
      <div>
        <Typography sx={{ mb: 5, typography: "h2" }} variant="h1">
          Términos y Condiciones
        </Typography>
      </div>

      {TyC.map((prg, j) => {
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
  );
}
