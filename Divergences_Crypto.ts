study("Divergences v2.1 [LTB]", overlay=true)

calcmacd = input(true, title="MACD")

calcmacda = input(true, title="MACD Histogram")

calcrsi = input(true, title="RSI")

calcstoc = input(true, title="Stochastic")

calccci = input(true, title="CCI")

calcmom = input(true, title="Momentum")

calcobv = input(true, title="OBV")

calcdi = input(true, title="Diosc")

calcvwmacd = input(true, title="VWmacd")

calccmf = input(true, title="Chaikin Money Flow")

showhidden = input(false, title="Show Hidden Divergences")

 

htime = period == '1' ? '5' :

  period == '3' ? '15' :

  period == '5' ? '15' :

  period == '15' ? '60' :

  period == '30' ? '60' :

  period == '45' ? '60' :

  period == '60' ? '240' :

  period == '120' ? '240' :

  period == '180' ? '240' :

  period == '240' ? 'D' :

  period == 'D' ? 'W' :

  'W'

 

_highestbars(ind) =>

    highest = high

    hb = 0

    for i = 1 to ind

        if highest < high[i]

            highest := high[i]

            hb := i

    hb

 

_lowestbars(ind) =>

    lowest = low

    lb = 0

    for i = 1 to ind

        if lowest > low[i]

            lowest := low[i]

            lb := i

    lb

 

TopsBots(tb) =>

    tUp = close >= open

    tDown = close <= open

    dir = tUp[1] and tDown ? -1 : tDown[1] and tUp ? 1 : nz(dir[1])

    TopsBots = tb == 1 ? tUp[1] and tDown and dir[1] != -1 ? highest(2) : na : tDown[1] and tUp and dir[1] != 1 ? lowest(2) : na

 

bb = nz(bb[1]) + 1

bb := change(time(htime)) != 0 ? 1 : bb

maxb = bb > nz(maxb[1]) ? bb : nz(maxb[1])

 

tops = bb==maxb ? security(tickerid, htime, TopsBots(1)) : na

bots = bb==maxb ? security(tickerid, htime, TopsBots(-1)) : na

// RSI

rsi = rsi(close, 14)

// MACD

fastMA = ema(close, 8)

slowMA = ema(close, 16)

macd = fastMA - slowMA

signal = sma(macd, 11)

deltamacd = macd - signal

// Momentum

moment = mom(close, 10)

// CCI

cci = cci(close, 10)

// OBV

obv = cum(change(close) > 0 ? volume : change(close) < 0 ? -volume : 0 * volume)

// Stoch

stk = sma(stoch(close, high, low, 14), 3)

// DIOSC

DI = change(high) - (-change(low))

trur = rma(tr, 14)

diosc = fixnan(100 * rma(DI, 14) / trur)

// volume weighted macd

maFast = vwma(close, 12)

maSlow = vwma(close, 26)

vwmacd = maFast - maSlow

// Chaikin money flow

Cmfm = ((close-low) - (high-close)) / (high - low)

Cmfv = Cmfm * volume

cmf = sma(Cmfv, 21) / sma(volume,21)

 

hib = _highestbars(maxb*2 - 1)

t2 = nz(t2[1]) + 1

divt = white

divth = white

if (not na(tops) or (na(tops) and _highestbars(t2+1) == 0))

    t1 = na(tops) ? 0 : hib

    divt := (calcrsi ? ((rsi[t1] < rsi[t2] and high[t1] >= high[t2]) ? red : divt) : divt)

    divt := (calcmacd ? ((macd[t1] < macd[t2] and high[t1] >= high[t2]) ? red : divt) : divt)

    divt := (calcmacda ? ((deltamacd[t1] < deltamacd[t2] and high[t1] >= high[t2]) ? red : divt) : divt)

    divt := (calcmom ? ((moment[t1] < moment[t2] and high[t1] >= high[t2]) ? red  : divt) : divt)

    divt := (calccci ? ((cci[t1] < cci[t2] and high[t1] >= high[t2]) ? red  : divt) : divt)

    divt := (calcobv ? ((obv[t1] < obv[t2] and high[t1] >= high[t2]) ? red  : divt) : divt)

    divt := (calcstoc ? ((stk[t1] < stk[t2] and high[t1] >= high[t2]) ? red  : divt) : divt)

    divt := (calcdi ? ((diosc[t1] < diosc[t2] and high[t1] >= high[t2]) ? red  : divt) : divt)

    divt := (calcvwmacd ? ((vwmacd[t1] < vwmacd[t2] and high[t1] >= high[t2]) ? red  : divt) : divt)

    divt := (calccmf ? ((cmf[t1] < cmf[t2] and high[t1] >= high[t2]) ? red  : divt) : divt)

    //hidden

    divth := (calcrsi ? ((rsi[t1] > rsi[t2] and high[t1] < high[t2]) ? gray : divth) : divth)

    divth := (calcmacd ? ((macd[t1] > macd[t2] and high[t1] < high[t2]) ? gray : divth) : divth)

    divth := (calcmacda ? ((deltamacd[t1] > deltamacd[t2] and high[t1] < high[t2]) ? gray : divth) : divth)

    divth := (calcmom ? ((moment[t1] > moment[t2] and high[t1] < high[t2]) ? gray  : divth) : divth)

    divth := (calccci ? ((cci[t1] > cci[t2] and high[t1] < high[t2]) ? gray  : divth) : divth)

    divth := (calcobv ? ((obv[t1] > obv[t2] and high[t1] < high[t2]) ? gray  : divth) : divth)

    divth := (calcstoc ? ((stk[t1] > stk[t2] and high[t1] < high[t2]) ? gray  : divth) : divth)

    divth := (calcdi ? ((diosc[t1] > diosc[t2] and high[t1] < high[t2]) ? gray  : divth) : divth)

    divth := (calcvwmacd ? ((vwmacd[t1] > vwmacd[t2] and high[t1] < high[t2]) ? gray  : divth) : divth)

    divth := (calccmf ? ((cmf[t1] > cmf[t2] and high[t1] < high[t2]) ? gray  : divth) : divth)

    if (not na(tops))

        t2 := hib

 

lob = _lowestbars(maxb*2 - 1)

b2 = nz(b2[1]) + 1

b1 = 0

divb = white

divbh = white

if (not na(bots)  or (na(bots) and _lowestbars(b2+1) == 0))

    b1 := na(bots) ? 0 : lob

    divb := (calcrsi ? ((rsi[b1] > rsi[b2]  and low[b1] <= low[b2]) ? lime : divb) : divb)

    divb := (calcmacd ? ((macd[b1] > macd[b2]  and low[b1] <= low[b2]) ? lime  : divb) : divb)

    divb := (calcmacda ? ((deltamacd[b1] > deltamacd[b2]  and low[b1] <= low[b2]) ? lime  : divb) : divb)

    divb := (calcmom ? ((moment[b1] > moment[b2]  and low[b1] <= low[b2]) ? lime : divb) : divb)

    divb := (calccci ? ((cci[b1] > cci[b2]  and low[b1] <= low[b2]) ? lime : divb) : divb)

    divb := (calcobv ? ((obv[b1] > obv[b2]  and low[b1] <= low[b2]) ? lime : divb) : divb)

    divb := (calcstoc ? ((stk[b1] > stk[b2]  and low[b1] <= low[b2]) ? lime : divb) : divb)

    divb := (calcdi ? ((diosc[b1] > diosc[b2]  and low[b1] <= low[b2]) ? lime : divb) : divb)

    divb := (calcvwmacd ? ((vwmacd[b1] > vwmacd[b2]  and low[b1] <= low[b2]) ? lime : divb) : divb)

    divb := (calccmf ? ((cmf[b1] > cmf[b2]  and low[b1] <= low[b2]) ? lime : divb) : divb)

    //hidden

    divbh := (calcrsi ? ((rsi[b1] < rsi[b2]  and low[b1] > low[b2]) ? gray : divbh) : divbh)

    divbh := (calcmacd ? ((macd[b1] < macd[b2]  and low[b1] > low[b2]) ? gray  : divbh) : divbh)

    divbh := (calcmacda ? ((deltamacd[b1] < deltamacd[b2]  and low[b1] > low[b2]) ? gray  : divbh) : divbh)

    divbh := (calcmom ? ((moment[b1] < moment[b2]  and low[b1] > low[b2]) ? gray : divbh) : divbh)

    divbh := (calccci ? ((cci[b1] < cci[b2]  and low[b1] > low[b2]) ? gray : divbh) : divbh)

    divbh := (calcobv ? ((obv[b1] < obv[b2]  and low[b1] > low[b2]) ? gray : divbh) : divbh)

    divbh := (calcstoc ? ((stk[b1] < stk[b2]  and low[b1] > low[b2]) ? gray : divbh) : divbh)

    divbh := (calcdi ? ((diosc[b1] < diosc[b2]  and low[b1] > low[b2]) ? gray : divbh) : divbh)

    divbh := (calcvwmacd ? ((vwmacd[b1] < vwmacd[b2]  and low[b1] > low[b2]) ? gray : divbh) : divbh)

    divbh := (calccmf ? ((cmf[b1] < cmf[b2]  and low[b1] > low[b2]) ? gray : divbh) : divbh)

    if (not na(bots))

        b2 := lob

   

plot(tops, color = divt != white ? divt : na, linewidth = 3, offset = -3)

plot(tops, color = divth != white and showhidden ? divth : na, linewidth = 1, offset = -3)

plotshape(na(tops) and divt==red,  style=shape.labeldown, color=red, location=location.abovebar, transp=20)

plot(bots, color = divb != white ? divb : na, linewidth = 3, offset = -3)

plot(bots, color = divbh != white and showhidden ? divbh : na, linewidth = 1, offset = -3)

plotshape(na(bots) and divb==lime,  style=shape.labelup, color=lime, location=location.belowbar, transp=20)

 

buy = (divb == lime)

sell = (divt == red)

alertcondition(buy, title='Buy', message='Positive Divergence. Buy Signal')

alertcondition(sell, title='Sell', message='Negative Divergence. Sell Signal')

Sent from Mail for Windows

 