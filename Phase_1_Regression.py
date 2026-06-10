import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

st.title("Phase 1: Dataset Loader & Regression Line")

# 1. User Inputs Dataset
uploaded_file = st.file_uploader("Upload your dataset (CSV)", type=["csv"])

if uploaded_file is not None:
    df = pd.read_csv(uploaded_file)
    
    # 2. System Displays Dataset
    st.subheader("Dataset Preview")
    st.dataframe(df)
    
    # Select columns for basic X and Y regression
    columns = df.select_dtypes(include=[np.number]).columns.tolist()
    if len(columns) >= 2:
        x_var = st.selectbox("Select X variable (Predictor)", columns, index=0)
        y_var = st.selectbox("Select Y variable (Target)", columns, index=1)
        
        # Simple Linear Regression calculation
        X = df[[x_var]].values
        y = df[y_var].values
        
        model = LinearRegression()
        model.fit(X, y)
        predictions = model.predict(X)
        
        # 3. Give a Regression Line Plot
        st.subheader("Regression Line Plot")
        fig, ax = plt.subplots()
        ax.scatter(X, y, color="blue", label="Actual Data")
        ax.plot(X, predictions, color="red", linewidth=2, label="Regression Line")
        ax.set_xlabel(x_var)
        ax.set_ylabel(y_var)
        ax.legend()
        st.pyplot(fig)
    else:
        st.error("The dataset needs at least 2 numerical columns to run a regression.")