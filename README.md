Abstract:
	Problem Statement:
		-Many softwares now-a-days can do dataset analysis by just typing the programming statements and then even do the plotting. 
		-but it doesn't provide a dynamic engagement of what is does, like after finding skewness, it pops a message 'right skew'
		-also it doesn't have a flow to it, like inputing the dataset, we have to manually split the data and perform loocv on 	every observation
		-dataset is analysed procedurally, will maybe sometimes miss some steps like not finding outliers, and is time consuming and complex to understand 
		-doesn't provide in-depth data analysis suggestions,support deep level suggestions, and info on what u should do for the data techie.
		-doesn't provide a framework,structure or architecture to the execution,flow and learning of the dataset.
	Objectives:
		-to create a software model, using build-in functions we will create a program that gives some small messages and all characteristics of the dataset in single instance. then,
		-to perform simple correlation between all variable pairs, and multiple correlation bw all var, find out its linear or non-linear, partial and total. then output the maximum 		and minimum correlation, all like a like a text message, like a reply for motivation and interactiveness and also plot a scatter for visual examples. then ask if u want to 		find correlation by pearson,kendall or spearman for analysis. also have a text based advantages and disadvantages of each correlation coefficient method for output, atleast 5 		for each before calling the methods. 
		-analyse the dataset,use exploratory data analysis and find outliers, output residual plots to analyse assumptions of linear regression
		-fit a linear and multiple regression model and use holdout(80-20),k-fold and loocv data split methods for testing, and find,compare effective models and use error 			metrics(MSE,RMSE,MAE,MAPE,R2,R2 Adj) to find the best model by validating the model on a testing set,using hypothesis testing using critical values like t,f for linear 		regression,chi like g,wald testings for logistic regression and confidence intervals and also plotting the lines in graph showing how it passes through mean of x1,x2,...xn 		and y and checking assumptions of errors like linearity,zero sum,homoscedasticity,independence or no autocorrelation, exogeneity, no perfect multicollinearity and normality. 		presenting it in a linear flow to the user to make it simple for him to interpret and understand with output messages.
		-to use aic,bic quantities for the model, and plotting residual plots(1. Plot of Residuals (eᵢ) on Y-axis vs. Predicted values (ŷᵢ) on X-axis, 2. Separate plots of Residuals 		(eᵢ) vs. each Predictor variable (Xⱼ), 3. Plot of Standardized Residuals vs Fitted values , Plot comparing the distribution of residuals to a theoretical normal
		distribution.)
		-to fit a logistic regression model on the available dataset, use gradient descent to optimise the parameters
		-use evaluation metrics like confusion matrix(accuracy, precision,recall,f1 score,specificity,false positive rate)
		-save the model algorithm parameters and use it to test other samples of another dataset of similar kind, then improve the model on em too
		-Also to use a naive bayes classifier algorithm, to classify categories,fit on the appropriate samples of dataset and also to use it to display interactive messages using 		probabilities
		-to build a web-browser or app for interactivity, decoration and motivation
		-to follow the rules,grammer of model building and procedures(problem definition, data collection, exploratory data analysis, data-preprocessing, train-test split, training 		data build model, calculate Coeff, evaluate by training metrics,check assumptions, validate by trsting data, compare metrics, refine if needed, interpret and deploy)
		-to make it simple, easy and most info learning in least time.
		-to make the system scalable, modular and adjustable for future requirements.
		-frontend using react.js,backend using node.js and express.js and using microservices using python libraries .