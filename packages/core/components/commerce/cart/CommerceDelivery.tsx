"use client";

import { useEffect, useState } from "react";
// eslint-disable-next-line import/no-duplicates
import es from "date-fns/locale/es";
// eslint-disable-next-line import/no-duplicates
import { isToday } from "date-fns";
import {
  Alert,
  BasicDialog,
  Box,
  BranchCard,
  Button,
  Grid,
  MenuItem,
  Paper,
  RadioGroup,
  Snackbar,
  StaticDatePicker,
  TextField,
  Typography,
} from "ui";
import {
  useCart,
  useClientInfo,
  useSellerInfo,
} from "../../../providers/hooks";
import { type DeliveryType, DeliveryTypes } from "../../../domain/seller";
import {
  generateSupplierTimeOptions,
  inXTime,
  isDisabledDay,
  tomorrow,
} from "../../../utils";
import type { BranchStateType } from "../../../domain/user";
import { getCorrespondentUnit } from "../../../data/api";
import { BranchForm } from "../user/BranchForm";

// -----------------------------------------------

interface CommerceAddressSelectorProps {
  deliveryType: DeliveryType;
  unitName: string;
  unitAddress: string;
  availableAddresses: BranchStateType[];
  onSelectAddress: (address: BranchStateType | undefined) => void;
  selectedAddress?: BranchStateType;
}

function CommerceAddressSelector({
  deliveryType,
  unitName,
  unitAddress,
  availableAddresses,
  onSelectAddress,
  selectedAddress,
}: CommerceAddressSelectorProps): JSX.Element {
  const [openBranchModal, setOpenBranchModal] = useState(false);
  const [openError, setOpenError] = useState(false);
  const { addAddress, error: addressError } = useClientInfo();

  useEffect(() => {
    if (addressError) {
      setOpenError(true);
    }
  }, [addressError]);

  return (
    <>
      {/* errorsnackbar */}
      <Snackbar
        open={openError}
        autoHideDuration={3000}
        onClose={(_e) => {
          setOpenError(false);
        }}
      >
        <Alert severity="error">
          ¡Hubo un error, creando tu Dirección! Intenta de nuevo.
        </Alert>
      </Snackbar>
      {/* Add branch modal */}
      <BasicDialog
        open={openBranchModal}
        title="Agrega una dirección"
        onClose={() => {
          setOpenBranchModal(false);
        }}
        closeMark
      >
        <Box sx={{ my: 1 }}>
          <BranchForm
            onUpsert={async (br, _act) => {
              try {
                await addAddress(br);
                setOpenBranchModal(false);
              } catch (_e) {
                setOpenError(true);
              }
            }}
          />
        </Box>
      </BasicDialog>
      <Box>
        {/* If delivery, show address selector */}
        {deliveryType === "delivery" ? (
          <Box sx={{ mt: 1, px: { xs: 2, md: 4 } }}>
            <Typography variant="h6" color="text.secondary">
              Escoge tu Dirección de Entrega.
            </Typography>

            {/* If no addresses, show warning */}
            {availableAddresses.length === 0 ? (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Aún no tienes direcciones registradas. Por favor, agrega una.
              </Alert>
            ) : null}

            {/* if selectedAddress, thow card with selected */}
            {selectedAddress ? (
              <BranchCard
                address={
                  <Typography>
                    <b>{selectedAddress.branchName}</b>
                    <br /> {selectedAddress.fullAddress}
                  </Typography>
                }
                selected
                sx={{ mx: { xs: 1, md: 4 }, my: 2 }}
                onClick={() => {
                  onSelectAddress(undefined);
                }}
              />
            ) : null}

            {/* if not selectedAddress, show the selector */}
            {!selectedAddress ? (
              <>
                {/* Address selector */}
                {availableAddresses.map((br) => (
                  <BranchCard
                    key={br.id}
                    address={
                      <Typography>
                        <b>{br.branchName}</b>
                        <br /> {br.fullAddress}
                      </Typography>
                    }
                    selected={false}
                    sx={{ mx: { xs: 1, md: 4 }, my: 2 }}
                    onClick={() => {
                      onSelectAddress(br);
                    }}
                  />
                ))}

                {/* Add address button */}
                <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => {
                      setOpenBranchModal(true);
                    }}
                  >
                    Agregar dirección
                  </Button>
                </Box>
              </>
            ) : null}
          </Box>
        ) : null}
        {deliveryType === "pickup" ? (
          <Box sx={{ mt: 1, px: { xs: 2, md: 4 } }}>
            <Typography variant="h6" color="text.secondary">
              Esta será la dirección de Recolección en Almacén.
            </Typography>
            <BranchCard
              address={
                <Typography>
                  <b>Proveedor:&nbsp;{unitName}</b>
                  <br /> {unitAddress}
                </Typography>
              }
              selected
              sx={{ mx: { xs: 1, md: 4 }, my: 2 }}
              disabled
            />
          </Box>
        ) : null}
      </Box>
    </>
  );
}

// -----------------------------------------------

export function CommerceDelivery(): JSX.Element {
  const {
    deliveryType,
    changeDeliveryType,
    comments,
    changeComments,
    deliveryDate,
    changeDeliveryDate,
    deliveryTime,
    changeDeliveryTime,
  } = useCart();
  const { addresses } = useClientInfo();
  const {
    deliveryAddress,
    changeDeliveryAddress,
    serviceAvailable,
    changeServiceAvailable,
  } = useCart();
  const { assignedUnit, sellerUnits, setSellerUnit } = useSellerInfo();
  const { apiURL, token, sellerId, defaultAddress } = useClientInfo();
  const [selectedUnit, setSelectedUnit] = useState(assignedUnit);
  const [noSAModal, setNoSAModal] = useState(false);

  // hook - if assignedUnit is not set, set it to the first unit
  useEffect(() => {
    if (!assignedUnit && sellerUnits.length > 0) {
      setSelectedUnit(sellerUnits[0]);
    } else if (assignedUnit) {
      setSelectedUnit(assignedUnit);
    }
  }, [assignedUnit, sellerUnits]);

  // hook - onChange deliveryAddress, set selectedUnit
  useEffect(() => {
    const _getCorrespondentUnit = async (): Promise<void> => {
      if (deliveryAddress) {
        const unitId = await getCorrespondentUnit(
          apiURL,
          token!,
          sellerId!,
          deliveryAddress.id!
        );
        const _unit = sellerUnits.find((u) => u.id === unitId);
        if (_unit) {
          // if unit is found, set it
          await setSellerUnit(_unit.id!);
          changeServiceAvailable(true);
        } else if (deliveryType === "delivery") {
          // if not & delivery -> set service not available
          setNoSAModal(true);
          changeServiceAvailable(false);
        } else {
          // if pickup, set first unit
          changeServiceAvailable(true);
        }
      }
    };
    void _getCorrespondentUnit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryAddress, deliveryType, sellerUnits]);

  // hook - load default address
  useEffect(() => {
    if (defaultAddress) {
      changeDeliveryAddress(defaultAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAddress]);

  // render vars
  const msgDeliv = deliveryType === "delivery" ? "Entrega" : "Recolección";
  const supDeliveryTimeWindowOptions = generateSupplierTimeOptions(
    selectedUnit?.deliverySchedules || [],
    selectedUnit?.deliveryWindowSize || 1,
    deliveryDate
  );
  const handleDisabledDates = (date: Date): boolean => {
    if (!selectedUnit || selectedUnit.deliverySchedules.length === 0) {
      // no delivery days
      return false;
    }
    // if returns True, day is disabled
    let dayDis = isDisabledDay(date, selectedUnit.deliverySchedules);
    // verify by time
    const _now = new Date();
    const _ctime = selectedUnit.cutOffTime + 12;
    const warndays = selectedUnit.warnDays;
    const _daydiff = date.getDate() - _now.getDate();
    const isSameMonth = date.getMonth() === _now.getMonth();
    if (_now.getHours() >= _ctime && _daydiff === 1 && warndays === 1) {
      // if it passsed cut off time for next day return true -> disabled
      dayDis = true;
    } else if (_daydiff < warndays && isSameMonth) {
      // if day diff is less or equal than warn days return false -> its ok
      dayDis = true;
    }
    const resp = dayDis || isToday(date); // today is disabled
    return resp;
  };
  return (
    <>
      <BasicDialog
        title="Zona de entrega no disponible"
        open={noSAModal}
        onClose={() => {
          setNoSAModal(false);
        }}
        closeMark={false}
        msg="Lo sentimos, por el momento no tenemos cobertura en tu zona de entrega."
        continueAction={{
          active: true,
          msg: "OK",
          actionFn: () => {
            setNoSAModal(false);
          },
        }}
      />
      <Box sx={{ px: { xs: 1, md: 10 }, mb: { xs: 3, md: 6 } }}>
        <Paper sx={{ py: 3 }}>
          {/* Delivery address */}
          <CommerceAddressSelector
            deliveryType={deliveryType}
            unitName={selectedUnit?.unitName || "-"}
            unitAddress={selectedUnit?.fullAddress || "-"}
            availableAddresses={addresses}
            onSelectAddress={changeDeliveryAddress}
            selectedAddress={deliveryAddress}
          />
          {/* show only if delivery address is not undefined */}
          {deliveryAddress ? (
            <>
              {/* Delivery type selector */}
              <Box>
                <Box sx={{ mt: 2, px: { xs: 2, md: 4 } }}>
                  <Typography variant="h6" color="text.secondary">
                    Escoge tu tipo de Pedido
                  </Typography>
                  {/* message in case only one delivery type is available */}
                  {(selectedUnit?.deliveryTypes || []).length === 1 ? (
                    <Typography variant="body2" color="text.secondary">
                      {selectedUnit?.deliveryTypes[0] === "pickup" ? (
                        <i>
                          * En tu zona, sólo están disponible la Recolección en
                          Almacén.
                        </i>
                      ) : null}
                    </Typography>
                  ) : null}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <RadioGroup
                    label=""
                    name="deliveryType"
                    defaultValue={deliveryType}
                    options={(selectedUnit?.deliveryTypes || ["delivery"]).map(
                      (dt) => ({
                        value: dt,
                        label: DeliveryTypes[dt],
                      })
                    )}
                    direction="row"
                    radioSx={{ mx: 4 }}
                    onChange={(value: string) => {
                      changeDeliveryType(value as DeliveryType);
                    }}
                  />
                </Box>
              </Box>
              {/* Show only if service is available */}
              {!serviceAvailable ? null : (
                <>
                  {/* Delivery date */}
                  <Box>
                    <Box sx={{ mt: 1, px: { xs: 2, md: 4 } }}>
                      <Typography variant="h6" color="text.secondary">
                        {`Escoge tu Fecha de ${msgDeliv}.`}
                      </Typography>
                    </Box>
                    <Grid container>
                      <Grid item xs={12} md={3} />
                      <Grid item xs={12} md={6} sx={{ pr: 1 }}>
                        <StaticDatePicker
                          locale={es}
                          minDate={tomorrow()}
                          maxDate={inXTime(15)}
                          isDateDisabled={handleDisabledDates}
                          dateValue={deliveryDate}
                          onChange={(v) => {
                            if (v) {
                              changeDeliveryDate(v);
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  {/* Delivery time */}
                  <Box sx={{ px: { xs: 2, md: 4 } }}>
                    {!deliveryDate && (
                      <Alert severity="info">
                        Para ver los horarios, selecciona una fecha de entrega
                      </Alert>
                    )}
                    {supDeliveryTimeWindowOptions.length > 0 ? (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="h6"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {`Escoge tu horario de  ${msgDeliv}.`}
                        </Typography>
                        <TextField
                          fullWidth
                          select
                          label={`Ventana de Horario de  ${msgDeliv}`}
                          value={deliveryTime || ""}
                          onChange={(e) => {
                            changeDeliveryTime(e.target.value);
                          }}
                        >
                          {supDeliveryTimeWindowOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>
                    ) : null}
                  </Box>
                  {/* Delivery instructions */}
                  <Box sx={{ mt: 3, px: { xs: 2, md: 4 } }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {`¿Algún comentario para la ${msgDeliv}?`}
                    </Typography>
                    <TextField
                      value={comments}
                      onChange={(e) => {
                        changeComments(e.target.value);
                      }}
                      multiline
                      rows={2}
                      fullWidth
                      placeholder="ej. Entregar por la puerta de servicio."
                    />
                  </Box>
                </>
              )}
            </>
          ) : null}
        </Paper>
      </Box>
    </>
  );
}
