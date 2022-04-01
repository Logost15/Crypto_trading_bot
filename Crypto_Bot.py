import pandas as pd
import sqlalchemy
from binance.client import Client
from binance import BinanceSocketManager
 
 

 
 
get_ipython().run_line_magic('run', './Binance_Keys.ipynb')
 
 

 
 
client = Client(api_key cV0cmV1YYDeyq5BXvr7eMklry7Ocvx7Jlp2AAB6JzJi8XbgwUQfdOc7xnZS6J3XK)
 
 
 
engine = sqlalchemy.create_engine('sqlite:///stream.db')
 
 

 
bsm = BinanceSocketManager(client)
 

 
 
socket = bsm.trade_socket(pair)
 
 

 
 
def createframe(msg):
    df = pd.DataFrame([msg])
    df = df.loc[:,['s','E','p']]
    df.columns = ['symbol','Time','Price']
    df.Price = df.Price.astype(float)
    df.Time = pd.to_datetime(df.Time, unit='ms')
    return df
 
 

 
 
await socket.__aenter__()
msg = await socket.recv()
frame = createframe(msg)
frame.to_sql(pair, engine, if_exists='append', index=False)
print(frame)
 

 
 
# STRATEGY Part
 
import sqlalchemy
import pandas as pd
from binance.client import Client
 

 
 
get_ipython().run_line_magic('run', './Binance_Keys.ipynb')
 
 

 
 
client = Client(api_key,api_secret)
 
 

 
 
engine = sqlalchemy.create_engine('sqlite:///'stream.db')
 

 
 
#Trendfollowing
#if the crypto was rising by x % -> Buy
#exit when profit is above 0.15% or loss is crossing -0.15%
 
 
 
 
def strategy(entry, lookback, qty, open_position=False):
    while True:
        df = pd.read_sql(pair, engine)
        lookbackperiod = df.iloc[-lookback:]
        cumret = (lookbackperiod.Price.pct_change() +1).cumprod() - 1
        if not open_position:
            if cumret[cumret.last_valid_index()] > entry:
                order = client.create_order(symbol=pair,
                                           side='BUY',
                                           type='MARKET',
                                           quantity=qty)
                print(order)
                open_position = True
                break
    if open_position:
        while True:
            df = pd.read_sql('BTCUSDT', engine)
            sincebuy = df.loc[df.Time > 
                              pd.to_datetime(order['transactTime'],
                                            unit='ms')]
            if len(sincebuy) > 1:
                sincebuyret = (sincebuy.Price.pct_change() +1).cumprod() - 1
                last_entry = sincebuyret[sincebuyret.last_valid_index()]
                if last_entry > 0.0015 or last_entry < -0.0015:
                    order = client.create_order(symbol=pair,
                                           side='SELL',
                                           type='MARKET',
                                           quantity=qty)
                    print(order)
                    break
 
 
