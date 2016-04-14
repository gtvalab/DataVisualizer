function checkAttributeType(dataAttribute)
	{
		if(dataAttribute == "Type")
		{
			return "Nominal";
		}
		else
		{
			return "Ordinal";
		}
	}