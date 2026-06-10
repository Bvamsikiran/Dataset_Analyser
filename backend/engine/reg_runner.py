#!/usr/bin/env python3
"""
=====================================================
REGRESSION ENGINE: Python Micro-Script
=====================================================

Lightweight computational helper that receives X and Y data via stdin,
performs linear regression using scikit-learn and pandas,
and outputs clean JSON with regression coefficients, metrics, and scatter points.

Input (JSON from Node.js via stdin):
{
  "x_values": [1, 2, 3, 4, 5],
  "y_values": [2, 4, 5, 4, 6]
}

Output (JSON to stdout):
{
  "slope": 0.5,
  "intercept": 1.5,
  "r2_score": 0.95,
  "mse": 0.25,
  "points": [[1, 2], [2, 4], [3, 5], [4, 4], [5, 6]],
  "line_coords": [[1, 2.0], [5, 4.0]]
}
"""

import json
import sys
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

def run_regression(x_values, y_values):
    """
    Perform linear regression on X and Y data.
    
    Args:
        x_values: List of numeric X coordinates
        y_values: List of numeric Y coordinates
    
    Returns:
        dict: Regression results including slope, intercept, R², MSE, and coordinates
    """
    try:
        # Convert to numpy arrays and reshape for sklearn
        X = np.array(x_values).reshape(-1, 1)
        y = np.array(y_values)
        
        # Create and fit model
        model = LinearRegression()
        model.fit(X, y)
        
        # Get predictions
        y_pred = model.predict(X)
        
        # Calculate metrics
        slope = model.coef_[0]
        intercept = model.intercept_
        r2 = r2_score(y, y_pred)
        mse = mean_squared_error(y, y_pred)
        
        # Create scatter points (original data)
        scatter_points = [[float(x), float(y)] for x, y in zip(x_values, y_values)]
        
        # Create regression line coordinates (min and max X for clean line rendering)
        x_min, x_max = min(x_values), max(x_values)
        y_at_min = slope * x_min + intercept
        y_at_max = slope * x_max + intercept
        line_coords = [[float(x_min), float(y_at_min)], [float(x_max), float(y_at_max)]]
        
        # Build output
        output = {
            "slope": float(slope),
            "intercept": float(intercept),
            "r2_score": float(r2),
            "mse": float(mse),
            "points": scatter_points,
            "line_coords": line_coords,
        }
        
        return output
    
    except Exception as e:
        return {"error": str(e)}

def main():
    """
    Main entry point: Read JSON from stdin, compute regression, output JSON to stdout
    """
    try:
        # Read JSON input from stdin
        input_data = sys.stdin.read()
        data = json.loads(input_data)
        
        x_values = data.get("x_values", [])
        y_values = data.get("y_values", [])
        
        # Validate input
        if not x_values or not y_values or len(x_values) != len(y_values):
            output = {"error": "Invalid input: x_values and y_values must be non-empty and equal length"}
            print(json.dumps(output))
            return
        
        # Run regression
        result = run_regression(x_values, y_values)
        
        # Output JSON to stdout (Node.js will parse this)
        print(json.dumps(result))
    
    except json.JSONDecodeError as e:
        output = {"error": f"JSON decode error: {str(e)}"}
        print(json.dumps(output))
    except Exception as e:
        output = {"error": f"Unexpected error: {str(e)}"}
        print(json.dumps(output))

if __name__ == "__main__":
    main()
