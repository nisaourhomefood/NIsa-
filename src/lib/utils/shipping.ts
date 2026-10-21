// Comprehensive Pincode & Routing Engine for NISA (Handcrafted in Tenali, Guntur District, AP - PIN 522201)
// Accurately calculates delivery fees, state/city hubs, transit days, and arrival dates from Tenali.

export interface ShippingEstimate {
  fee: number;
  zoneKey: 'hyperlocal' | 'telugu_states' | 'south_india' | 'west_central' | 'north_east_india' | 'remote_air';
  zoneLabel: string;
  locationName: string;
  minDays: number;
  maxDays: number;
  estimatedArrival: string;
  dispatchNote: string;
  isFree: boolean;
}

export const PICKUP_PINCODE = '522201'; // Tenali Kitchen, Guntur district, Andhra Pradesh
export const FREE_SHIPPING_THRESHOLD = 2499; // Free express shipping unlocked on orders >= ₹2,499

// Calculate dynamic formatted arrival date range from today
export function getEstimatedDeliveryDateByDays(minDays: number, maxDays: number): string {
  const now = new Date();
  
  const minDate = new Date(now);
  minDate.setDate(now.getDate() + minDays);

  const maxDate = new Date(now);
  maxDate.setDate(now.getDate() + maxDays);

  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  
  const minStr = minDate.toLocaleDateString('en-IN', options);
  const maxStr = maxDate.toLocaleDateString('en-IN', options);

  if (minStr === maxStr) return minStr;
  return `${minStr} – ${maxStr}`;
}

export function calculateShippingFee(
  pincode: string | undefined | null,
  subtotal: number = 0
): ShippingEstimate {
  const clean = (pincode || '').replace(/\D/g, '');

  // Default if invalid / empty
  if (clean.length !== 6) {
    const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;
    return {
      fee: isFree ? 0 : 49,
      zoneKey: 'telugu_states',
      zoneLabel: 'Standard Andhra & Pan-India Delivery',
      locationName: 'India',
      minDays: 3,
      maxDays: 5,
      estimatedArrival: getEstimatedDeliveryDateByDays(3, 5),
      dispatchNote: 'Freshly cooked & dispatched from Tenali Kitchen in 24–48 hours',
      isFree,
    };
  }

  const prefix2 = clean.slice(0, 2);
  const prefix3 = clean.slice(0, 3);
  const prefix1 = clean[0];

  let fee = 89;
  let zoneKey: ShippingEstimate['zoneKey'] = 'north_east_india';
  let zoneLabel = 'Pan-India Express Delivery';
  let locationName = 'India';
  let minDays = 4;
  let maxDays = 6;

  // 1. Tenali & Guntur Hyperlocal (522xxx)
  if (prefix3 === '522') {
    fee = 29;
    zoneKey = 'hyperlocal';
    zoneLabel = 'Local Tenali & Guntur District Direct Dispatch';
    locationName = 'Tenali / Guntur / Amaravati';
    minDays = 1;
    maxDays = 2;
  }
  // 2. Andhra Pradesh & Telangana (50xxxx - 53xxxx)
  else if (['50', '51', '52', '53'].includes(prefix2)) {
    fee = 49;
    zoneKey = 'telugu_states';
    zoneLabel = 'Andhra Pradesh & Telangana Express Courier';
    if (['500', '501', '502'].includes(prefix3)) locationName = 'Hyderabad / Secunderabad';
    else if (prefix3 === '520') locationName = 'Vijayawada Region';
    else if (prefix3 === '530') locationName = 'Visakhapatnam (Vizag)';
    else if (prefix3 === '517') locationName = 'Tirupati / Chittoor';
    else if (prefix3 === '533') locationName = 'Rajahmundry / Kakinada';
    else if (prefix3 === '518') locationName = 'Kurnool';
    else if (prefix3 === '506') locationName = 'Warangal';
    else locationName = 'Andhra Pradesh / Telangana';
    minDays = 2;
    maxDays = 3;
  }
  // 3. Karnataka, Tamil Nadu, Kerala (56xxxx - 69xxxx)
  else if (['56', '57', '58', '59', '60', '61', '62', '63', '64', '67', '68', '69'].includes(prefix2)) {
    fee = 69;
    zoneKey = 'south_india';
    zoneLabel = 'South India Express Line';
    if (['560', '561', '562'].includes(prefix3)) locationName = 'Bengaluru Urban / Rural';
    else if (['600', '601', '602'].includes(prefix3)) locationName = 'Chennai Region';
    else if (prefix3 === '682') locationName = 'Kochi / Ernakulam';
    else if (prefix3 === '641') locationName = 'Coimbatore';
    else if (prefix3 === '570') locationName = 'Mysuru';
    else if (['56', '57', '58', '59'].includes(prefix2)) locationName = 'Karnataka';
    else if (['60', '61', '62', '63', '64'].includes(prefix2)) locationName = 'Tamil Nadu';
    else locationName = 'Kerala';
    minDays = 3;
    maxDays = 4;
  }
  // 4. Maharashtra & Goa (40xxxx - 44xxxx)
  else if (['40', '41', '42', '43', '44'].includes(prefix2)) {
    fee = 79;
    zoneKey = 'west_central';
    zoneLabel = 'Western Express (Maharashtra & Goa)';
    if (['400', '401'].includes(prefix3)) locationName = 'Mumbai / Navi Mumbai / Thane';
    else if (prefix3 === '411') locationName = 'Pune';
    else if (prefix3 === '440') locationName = 'Nagpur';
    else if (prefix3 === '403') locationName = 'Goa';
    else locationName = 'Maharashtra';
    minDays = 3;
    maxDays = 5;
  }
  // 5. Madhya Pradesh & Chhattisgarh (45xxxx - 49xxxx)
  else if (['45', '46', '47', '48', '49'].includes(prefix2)) {
    fee = 79;
    zoneKey = 'west_central';
    zoneLabel = 'Central India Corridor (MP & CG)';
    if (prefix3 === '452') locationName = 'Indore';
    else if (prefix3 === '462') locationName = 'Bhopal';
    else if (prefix3 === '492') locationName = 'Raipur';
    else if (prefix2 === '49') locationName = 'Chhattisgarh';
    else locationName = 'Madhya Pradesh';
    minDays = 4;
    maxDays = 5;
  }
  // 6. Delhi NCR & UP (11xxxx, 12xxxx, 20xxxx - 28xxxx)
  else if (['11', '12', '20', '21', '22', '23', '24', '25', '26', '27', '28'].includes(prefix2)) {
    fee = 89;
    zoneKey = 'north_east_india';
    zoneLabel = 'North India Express (Delhi NCR & UP)';
    if (prefix2 === '11') locationName = 'New Delhi NCR';
    else if (['121', '122'].includes(prefix3)) locationName = 'Gurugram / Faridabad';
    else if (['201', '203'].includes(prefix3)) locationName = 'Noida / Ghaziabad';
    else if (prefix3 === '226') locationName = 'Lucknow';
    else locationName = 'Uttar Pradesh / NCR';
    minDays = 4;
    maxDays = 5;
  }
  // 7. Gujarat, Rajasthan, Punjab, Haryana (30xxxx - 39xxxx, 13xxxx - 17xxxx)
  else if (['30', '31', '32', '33', '34', '36', '37', '38', '39', '13', '14', '15', '16', '17'].includes(prefix2)) {
    fee = 89;
    zoneKey = 'north_east_india';
    zoneLabel = 'North & West Regional Line';
    if (prefix3 === '380') locationName = 'Ahmedabad';
    else if (prefix3 === '302') locationName = 'Jaipur';
    else if (prefix3 === '160') locationName = 'Chandigarh';
    else if (['36', '37', '38', '39'].includes(prefix2)) locationName = 'Gujarat';
    else if (['30', '31', '32', '33', '34'].includes(prefix2)) locationName = 'Rajasthan';
    else if (['14', '15'].includes(prefix2)) locationName = 'Punjab';
    else locationName = 'North India';
    minDays = 4;
    maxDays = 6;
  }
  // 8. East India (West Bengal, Odisha, Bihar, Jharkhand: 70-77, 80-85)
  else if (['70', '71', '72', '73', '74', '75', '76', '77', '80', '81', '82', '83', '84', '85'].includes(prefix2)) {
    fee = 89;
    zoneKey = 'north_east_india';
    zoneLabel = 'Eastern India Corridor';
    if (['700', '701'].includes(prefix3)) locationName = 'Kolkata Metropolitan';
    else if (prefix3 === '751') locationName = 'Bhubaneswar';
    else if (prefix3 === '800') locationName = 'Patna';
    else if (['75', '76', '77'].includes(prefix2)) locationName = 'Odisha';
    else if (['70', '71', '72', '73', '74'].includes(prefix2)) locationName = 'West Bengal';
    else locationName = 'Bihar & Jharkhand';
    minDays = 4;
    maxDays = 6;
  }
  // 9. Remote / Air Cargo / J&K / North-East / Andaman (18-19, 78-79, 744)
  else if (['18', '19', '78', '79'].includes(prefix2) || prefix3 === '744') {
    fee = 149;
    zoneKey = 'remote_air';
    zoneLabel = 'Special Air Cargo Route (NE / J&K / Islands)';
    if (prefix2 === '78' || prefix2 === '79') locationName = 'Assam & North-East';
    else if (prefix2 === '18' || prefix2 === '19') locationName = 'Jammu & Kashmir / Ladakh';
    else if (prefix3 === '744') locationName = 'Andaman & Nicobar Islands';
    else locationName = 'Special Cargo Zone';
    minDays = 5;
    maxDays = 7;
  }

  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const finalFee = isFree ? 0 : fee;

  return {
    fee: finalFee,
    zoneKey,
    zoneLabel: isFree ? `Free Express Shipping (${zoneLabel})` : zoneLabel,
    locationName,
    minDays,
    maxDays,
    estimatedArrival: getEstimatedDeliveryDateByDays(minDays, maxDays),
    dispatchNote: 'Freshly prepared in Tenali & dispatched within 24–48 hours with live tracking',
    isFree,
  };
}
