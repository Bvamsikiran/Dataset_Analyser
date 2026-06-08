import streamlit as st
import pandas as pd
import numpy as np

st.title('My First Data App')
st.write("Here is a Sample DataFrame: ")
# Create a sample DataFrame
data = pd.DataFrame(
    np.random.randn(20,3),
    columns=['Metric A', 'Metric B', 'Metric C']
)

#display interactive table
st.dataframe(data)
# Create a line chart
st.line_chart(data)
